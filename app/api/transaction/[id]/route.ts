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

    // Prepare update data
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updatedAt: new Date(),
    }
    // Only update fields that exist in the Transaction model
    if (data.statusReason) updateData.statusReason = data.statusReason
    if (data.amountPaid) updateData.amountPaid = data.amountPaid
    if (data.cryptoAmount) updateData.cryptoAmount = data.cryptoAmount
    if (data.totalFeeInFiat) updateData.totalFeeInFiat = data.totalFeeInFiat
    if (data.transakFeeAmount) updateData.transakFeeAmount = data.transakFeeAmount
    if (data.fiatAmountInUsd) updateData.fiatAmountInUsd = String(data.fiatAmountInUsd)
    if (data.countryCode) updateData.countryCode = data.countryCode
    if (data.stateCode) updateData.stateCode = data.stateCode
    if (data.cardPaymentData) updateData.cardPaymentData = data.cardPaymentData
    if (data.statusHistories) updateData.statusHistories = data.statusHistories
    if (data.walletLink) updateData.walletLink = data.walletLink

    const updated = await prisma.transaction.update({
      where: { id: transaction.id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error updating transaction:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
