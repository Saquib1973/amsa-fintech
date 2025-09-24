import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * @description Get a specific transaction by ID
 * @param req Request object
 * @param params Object containing the transaction ID
 * @returns Transaction data or error response
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  const userId = session?.user.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: id,
        userId: userId, // Ensure user can only access their own transactions
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (err) {
    console.error('Error fetching transaction:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  const userId = session?.user.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
  }

  // Find the transaction and ensure it belongs to the user
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  })

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  }

  try {
    // Get the access token from the database
    const accessTokenConfig = await prisma.config.findFirst({
      where: {
        key: 'TRANSAK_ACCESS_TOKEN',
      },
    });

    if (!accessTokenConfig) {
      return NextResponse.json(
        { error: 'Transak access token not found' },
        { status: 500 }
      );
    }

    const parsedToken = JSON.parse(accessTokenConfig.value);

    // Make the request to Transak API
    const response = await fetch(
      `https://api-stg.transak.com/partners/api/v2/order/${id}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'access-token': parsedToken.accessToken,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to fetch order status' },
        { status: response.status }
      );
    }

    const statusData = await response.json();
    const data = statusData.data || statusData; // handle both wrapped and direct

    // Map Transak status to our TransactionStatus enum if needed
    let newStatus = transaction.status
    switch (data.status) {
      case 'COMPLETED':
        newStatus = 'COMPLETED'
        break
      case 'FAILED':
        newStatus = 'FAILED'
        break
      case 'CANCELLED':
        newStatus = 'CANCELLED'
        break
      case 'EXPIRED':
        newStatus = 'EXPIRED'
        break
      case 'PROCESSING':
        newStatus = 'PROCESSING'
        break
      case 'PENDING_DELIVERY_FROM_TRANSAK':
      case 'AWAITING_PAYMENT_FROM_USER':
      case 'PAYMENT_DONE_MARKED_BY_USER':
      default:
        newStatus = 'PENDING'
        break
    }

    // Normalize numeric fields from Transak (can arrive as strings)
    const toNumber = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : Number(v))

    const finalFields = {
      statusReason: data.statusReason,
      amountPaid: toNumber(data.amountPaid),
      cryptoAmount: toNumber(data.cryptoAmount),
      totalFeeInFiat: toNumber(data.totalFeeInFiat),
      transakFeeAmount: toNumber(data.transakFeeAmount),
      fiatAmountInUsd: data.fiatAmountInUsd ? String(data.fiatAmountInUsd) : undefined,
      countryCode: data.countryCode,
      stateCode: data.stateCode,
      cardPaymentData: data.cardPaymentData,
      statusHistories: data.statusHistories,
      walletLink: data.walletLink,
      // Also capture fiat/crypto currencies and fiatAmount if present
      fiatCurrency: data.fiatCurrency ?? transaction.fiatCurrency,
      cryptoCurrency: data.cryptoCurrency ?? transaction.cryptoCurrency,
      fiatAmount: toNumber(data.fiatAmount) ?? transaction.fiatAmount,
    }

    const persisted = await prisma.$transaction(async (tx) => {
      const existingTx = await tx.transaction.findFirst({
        where: { id: transaction.id, userId: userId },
      })
      if (!existingTx) return null

      const wasPreviouslyCompleted = existingTx.status === 'COMPLETED'

      const updated = await tx.transaction.update({
        where: { id: existingTx.id },
        data: {
          status: newStatus,
          updatedAt: new Date(),
          statusReason: finalFields.statusReason,
          amountPaid: finalFields.amountPaid ?? existingTx.amountPaid,
          cryptoAmount: finalFields.cryptoAmount ?? existingTx.cryptoAmount,
          totalFeeInFiat: finalFields.totalFeeInFiat ?? existingTx.totalFeeInFiat,
          transakFeeAmount: finalFields.transakFeeAmount ?? existingTx.transakFeeAmount,
          fiatAmountInUsd: finalFields.fiatAmountInUsd ?? existingTx.fiatAmountInUsd,
          countryCode: finalFields.countryCode ?? existingTx.countryCode,
          stateCode: finalFields.stateCode ?? existingTx.stateCode,
          cardPaymentData: finalFields.cardPaymentData ?? existingTx.cardPaymentData,
          statusHistories: finalFields.statusHistories ?? existingTx.statusHistories,
          walletLink: finalFields.walletLink ?? existingTx.walletLink,
          fiatCurrency: finalFields.fiatCurrency,
          cryptoCurrency: finalFields.cryptoCurrency,
          fiatAmount: finalFields.fiatAmount,
        },
      })

      if (newStatus === 'COMPLETED') {
        // Use authoritative fields for holdings math
        const finalCryptoAmount = Number(updated.cryptoAmount ?? 0)
        const finalFiatAmount = Number(updated.amountPaid ?? updated.fiatAmount ?? 0)
        const symbol = updated.cryptoCurrency || ''
        const currency = updated.fiatCurrency || 'USD'

        const existingHolding = await tx.holding.findUnique({
          where: {
            userId_symbol_fiatCurrency: {
              userId: userId,
              symbol,
              fiatCurrency: currency,
            },
          },
        })

        // If first completion, increment; if previously completed but holding missing, create now
        if ((!wasPreviouslyCompleted || !existingHolding) && symbol && finalCryptoAmount > 0 && finalFiatAmount > 0) {
          if (existingHolding && !wasPreviouslyCompleted) {
            const newQuantity = existingHolding.quantity + finalCryptoAmount
            const newTotalInvested = existingHolding.totalInvested + finalFiatAmount
            const newAvgPrice = newTotalInvested / newQuantity
            await tx.holding.update({
              where: {
                userId_symbol_fiatCurrency: {
                  userId: userId,
                  symbol,
                  fiatCurrency: currency,
                },
              },
              data: {
                quantity: newQuantity,
                totalInvested: newTotalInvested,
                avgBuyPrice: newAvgPrice,
              },
            })
          } else if (!existingHolding) {
            await tx.holding.create({
              data: {
                userId: userId,
                symbol,
                fiatCurrency: currency,
                quantity: finalCryptoAmount,
                totalInvested: finalFiatAmount,
                avgBuyPrice: finalFiatAmount / finalCryptoAmount,
              },
            })
          }
        }
      }

      return updated
    })

    return NextResponse.json(persisted)
  } catch (err) {
    console.error('Error updating transaction:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
