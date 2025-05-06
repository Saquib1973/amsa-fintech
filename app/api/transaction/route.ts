import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * @description Get all transactions for a user
 * @param req (SearchParams : page, rowsPerPage)
 * @returns
 */
export async function GET(req: Request) {
  const session = await getSession()
  const id = session?.user.id
  if (!id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const pageParam = searchParams.get("page")
  const rowsPerPageParam = searchParams.get("rowsPerPage")

  let transactions

  try {
    if (pageParam && rowsPerPageParam) {
      const page = parseInt(pageParam, 10)
      const rowsPerPage = parseInt(rowsPerPageParam, 10)
      const skip = (page - 1) * rowsPerPage
      const take = rowsPerPage

      transactions = await prisma.transaction.findMany({
        where: { userId: id },
        skip,
        take,
      })
    } else {
      transactions = await prisma.transaction.findMany({
        where: { userId: id },
      })
    }

    return NextResponse.json(transactions)
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()
  const id = session?.user.id
  if (!id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { isBuyOrSell, fiatAmount, fiatCurrency, cryptoCurrency, walletLink, walletAddress, network } = await req.json();
    const trnasaction = await prisma.transaction.create({
      data: {
        userId: id,
        isBuyOrSell,
        fiatAmount,
        fiatCurrency,
        cryptoCurrency,
        walletLink,
        walletAddress,
        network,
      },
    })

    return NextResponse.json(trnasaction);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
