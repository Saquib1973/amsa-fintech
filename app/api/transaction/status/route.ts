import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Map Transak statuses to our database enum values
const mapTransakStatusToDbStatus = (transakStatus: string) => {
  const statusMap: Record<string, 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED'> = {
    AWAITING_PAYMENT_FROM_USER: 'PENDING',
    ORDER_CREATED: 'PENDING',
    ORDER_PROCESSING: 'PROCESSING',
    ORDER_COMPLETED: 'COMPLETED',
    ORDER_FAILED: 'FAILED',
    ORDER_CANCELLED: 'CANCELLED',
    ORDER_EXPIRED: 'EXPIRED',
    PAYMENT_PENDING: 'PENDING',
    PAYMENT_PROCESSING: 'PROCESSING',
    PAYMENT_COMPLETED: 'COMPLETED',
    PAYMENT_FAILED: 'FAILED',
    PAYMENT_CANCELLED: 'CANCELLED',
    PAYMENT_EXPIRED: 'EXPIRED',
    COMPLETED: 'COMPLETED',
    SUCCESS: 'COMPLETED',
    SUCCESSFUL: 'COMPLETED',
    DONE: 'COMPLETED',
    FINALIZED: 'COMPLETED',
    SETTLED: 'COMPLETED',
    CONFIRMED: 'COMPLETED',
  };
  return statusMap[transakStatus] || 'PENDING';
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Helper: fetch token from DB
    const getTokenFromDb = async () => {
      const row = await prisma.config.findFirst({ where: { key: 'TRANSAK_ACCESS_TOKEN' } });
      return row?.value ? JSON.parse(row.value) : null;
    };

    // Helper: call Transak order API
    const fetchOrder = async (accessToken: string) => {
      return await fetch(
        `https://api-stg.transak.com/partners/api/v2/order/${orderId}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'access-token': accessToken,
          },
        }
      );
    };

    // Ensure we have a token; if missing, try refresh once
    let token = await getTokenFromDb();
    if (!token?.accessToken) {
      await fetch(`${new URL('/api/admin/transak/refresh-token', request.url)}`, { method: 'POST' });
      token = await getTokenFromDb();
    }

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Transak access token not available' }, { status: 500 });
    }

    // Make the request to Transak API
    let response = await fetchOrder(token.accessToken);

    // If unauthorized, refresh token once and retry
    if (response.status === 401) {
      await fetch(`${new URL('/api/admin/transak/refresh-token', request.url)}`, { method: 'POST' });
      token = await getTokenFromDb();
      if (token?.accessToken) {
        response = await fetchOrder(token.accessToken);
      }
    }

    if (!response.ok) {
      let message = 'Failed to fetch order status';
      try {
        const error = await response.json();
        message = error.message || message;
      } catch {}
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const body = await response.json();

    const d = body?.data ?? body; // Some responses may wrap in { data }
    const orderIdFromRes = d?.id || d?.orderId || orderId;
    const mappedStatus = mapTransakStatusToDbStatus(d?.status ?? d?.orderStatus ?? 'PENDING');

    // Ensure the transaction exists so we can update and link to userId
    const existingTx = await prisma.transaction.findUnique({ where: { id: orderIdFromRes } });
    if (!existingTx) {
      // If we don't have a transaction record, return the fetched data without persisting
      return NextResponse.json({ data: body, note: 'Transaction not found locally; skipping persist.' });
    }

    // Gather authoritative fields from Transak response
    const finalFields = {
      fiatAmount: d?.fiatAmount ?? existingTx.fiatAmount,
      amountPaid: d?.amountPaid ?? existingTx.amountPaid,
      cryptoAmount: d?.cryptoAmount ?? existingTx.cryptoAmount,
      totalFeeInFiat: d?.totalFeeInFiat ?? existingTx.totalFeeInFiat,
      fiatCurrency: d?.fiatCurrency ?? existingTx.fiatCurrency,
      cryptoCurrency: d?.cryptoCurrency ?? existingTx.cryptoCurrency,
      walletLink: d?.walletLink ?? existingTx.walletLink,
      walletAddress: d?.walletAddress ?? existingTx.walletAddress,
      network: d?.network ?? existingTx.network,
      paymentOptionId: d?.paymentOptionId ?? existingTx.paymentOptionId,
      fiatAmountInUsd:
        d?.fiatAmountInUsd !== undefined && d?.fiatAmountInUsd !== null
          ? String(d.fiatAmountInUsd)
          : existingTx.fiatAmountInUsd ?? null,
      statusHistories: d?.statusHistories ?? existingTx.statusHistories,
    };

    const persisted = await prisma.$transaction(async (tx) => {
      const wasPreviouslyCompleted = existingTx.status === 'COMPLETED';

      const updated = await tx.transaction.update({
        where: { id: existingTx.id },
        data: {
          status: mappedStatus,
          statusHistories: finalFields.statusHistories,
          fiatAmount: finalFields.fiatAmount,
          fiatCurrency: finalFields.fiatCurrency,
          cryptoCurrency: finalFields.cryptoCurrency,
          walletLink: finalFields.walletLink,
          walletAddress: finalFields.walletAddress,
          network: finalFields.network,
          paymentOptionId: finalFields.paymentOptionId,
          fiatAmountInUsd: finalFields.fiatAmountInUsd,
          amountPaid: finalFields.amountPaid,
          cryptoAmount: finalFields.cryptoAmount,
          totalFeeInFiat: finalFields.totalFeeInFiat,
        },
      });

      if (mappedStatus === 'COMPLETED') {
        const toNumber = (v: unknown) => (v === undefined || v === null || v === '' ? 0 : Number(v));
        const finalCryptoAmount = toNumber(finalFields.cryptoAmount ?? existingTx.cryptoAmount);
        const finalFiatAmount = toNumber((finalFields.amountPaid ?? finalFields.fiatAmount ?? existingTx.amountPaid ?? existingTx.fiatAmount));
        const symbol = finalFields.cryptoCurrency || '';
        const currency = finalFields.fiatCurrency || 'USD';
        const isSell = existingTx.isBuyOrSell === 'SELL';

        const existingHolding = await tx.holding.findUnique({
          where: {
            userId_symbol_fiatCurrency: {
              userId: existingTx.userId,
              symbol,
              fiatCurrency: currency,
            },
          },
        });

        console.log('[STATUS] Holding upsert check', {
          symbol,
          currency,
          finalCryptoAmount,
          finalFiatAmount,
          mappedStatus,
          wasPreviouslyCompleted,
          holdingExists: !!existingHolding,
        });

        if ((!wasPreviouslyCompleted || !existingHolding) && symbol && finalCryptoAmount > 0 && finalFiatAmount > 0) {
          if (isSell) {
            if (existingHolding && !wasPreviouslyCompleted) {
              const sellQty = finalCryptoAmount;
              const newQuantity = Math.max(0, existingHolding.quantity - sellQty);
              const reduceInvestedBy = existingHolding.avgBuyPrice * sellQty;
              const newTotalInvested = Math.max(0, existingHolding.totalInvested - reduceInvestedBy);
              if (newQuantity === 0) {
                await tx.holding.delete({
                  where: {
                    userId_symbol_fiatCurrency: {
                      userId: existingTx.userId,
                      symbol,
                      fiatCurrency: currency,
                    },
                  },
                });
              } else {
                await tx.holding.update({
                  where: {
                    userId_symbol_fiatCurrency: {
                      userId: existingTx.userId,
                      symbol,
                      fiatCurrency: currency,
                    },
                  },
                  data: {
                    quantity: newQuantity,
                    totalInvested: newTotalInvested,
                  },
                });
              }
            }
          } else {
            if (existingHolding) {
              const newQuantity = existingHolding.quantity + finalCryptoAmount;
              const newTotalInvested = existingHolding.totalInvested + finalFiatAmount;
              const newAvgPrice = newTotalInvested / newQuantity;

              await tx.holding.update({
                where: {
                  userId_symbol_fiatCurrency: {
                    userId: existingTx.userId,
                    symbol,
                    fiatCurrency: currency,
                  },
                },
                data: {
                  quantity: newQuantity,
                  totalInvested: newTotalInvested,
                  avgBuyPrice: newAvgPrice,
                },
              });
              console.log('[STATUS] Holding updated', { symbol, currency, newQuantity, newTotalInvested });
            } else {
              await tx.holding.create({
                data: {
                  userId: existingTx.userId,
                  symbol,
                  fiatCurrency: currency,
                  quantity: finalCryptoAmount,
                  totalInvested: finalFiatAmount,
                  avgBuyPrice: finalFiatAmount / finalCryptoAmount,
                },
              });
              console.log('[STATUS] Holding created', { symbol, currency, quantity: finalCryptoAmount, totalInvested: finalFiatAmount });
            }
          }
        }
      }

      return updated;
    });

    return NextResponse.json({ data: body, persisted });
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
