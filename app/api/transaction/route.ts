import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { TransactionStatus } from '@prisma/client'

// Map Transak statuses to our database enum values
const mapTransakStatusToDbStatus = (transakStatus: string): TransactionStatus => {
  const statusMap: Record<string, TransactionStatus> = {
    'AWAITING_PAYMENT_FROM_USER': 'PENDING',
    'ORDER_CREATED': 'PENDING',
    'ORDER_PROCESSING': 'PROCESSING',
    'ORDER_COMPLETED': 'COMPLETED',
    'ORDER_FAILED': 'FAILED',
    'ORDER_CANCELLED': 'CANCELLED',
    'ORDER_EXPIRED': 'EXPIRED',
    'PAYMENT_PENDING': 'PENDING',
    'PAYMENT_PROCESSING': 'PROCESSING',
    'PAYMENT_COMPLETED': 'COMPLETED',
    'PAYMENT_FAILED': 'FAILED',
    'PAYMENT_CANCELLED': 'CANCELLED',
    'PAYMENT_EXPIRED': 'EXPIRED',
    'COMPLETED': 'COMPLETED',
    'SUCCESS': 'COMPLETED',
    'SUCCESSFUL': 'COMPLETED',
    'DONE': 'COMPLETED',
    'FINALIZED': 'COMPLETED',
    'SETTLED': 'COMPLETED',
    'CONFIRMED': 'COMPLETED',
  }

  return statusMap[transakStatus] || 'PENDING'
}

export async function POST(req: Request) {
  const session = await getSession()
  const user_id = session?.user.id
  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const {id, isBuyOrSell, fiatAmount, fiatCurrency, cryptoCurrency, walletLink, walletAddress, network, status, paymentOptionId, fiatAmountInUsd, statusHistories, amountPaid, cryptoAmount, totalFeeInFiat, countryCode, stateCode, statusReason, transakFeeAmount } = await req.json();
    console.log('Saving transaction with status:', status);

    // Map the Transak status to our database enum
    const mappedStatus = mapTransakStatusToDbStatus(status)

    const trnasaction = await prisma.transaction.create({
      data: {
        id: id,
        userId: user_id,
        isBuyOrSell,
        fiatAmount,
        fiatCurrency,
        cryptoCurrency,
        walletLink,
        walletAddress,
        network,
        status: mappedStatus,
        paymentOptionId,
        fiatAmountInUsd,
        statusHistories,
        amountPaid,
        cryptoAmount,
        totalFeeInFiat,
        countryCode,
        stateCode,
        statusReason,
        transakFeeAmount,
      },
    })

    return NextResponse.json(trnasaction);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}


export async function PUT(req: Request) {
  const session = await getSession()
  const user_id = session?.user.id
  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const {
      id,
      status,
      statusHistories,
      fiatAmount,
      fiatCurrency,
      cryptoCurrency,
      walletLink,
      walletAddress,
      network,
      paymentOptionId,
      fiatAmountInUsd,
    } = await req.json()

    // Map the Transak status to our database enum
    const mappedStatus = mapTransakStatusToDbStatus(status)

    // Check if transaction exists, if not create it
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: id }
    })

    let transaction
    if (existingTransaction) {
      // Update existing transaction
      transaction = await prisma.transaction.update({
        where: {
          id: id,
        },
        data: {
          status: mappedStatus,
          statusHistories,
          fiatAmount,
          fiatCurrency,
          cryptoCurrency,
          walletLink,
          walletAddress,
          network,
          paymentOptionId,
          fiatAmountInUsd,
        },
      })
    } else {
      // Create new transaction if it doesn't exist
      transaction = await prisma.transaction.create({
        data: {
          id: id,
          userId: user_id,
          status: mappedStatus,
          statusHistories,
          fiatAmount,
          fiatCurrency,
          cryptoCurrency,
          walletLink,
          walletAddress,
          network,
          paymentOptionId,
          fiatAmountInUsd,
        },
      })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Transaction update error:', error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
