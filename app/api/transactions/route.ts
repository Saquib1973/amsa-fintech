import { NextResponse } from 'next/server'
import { getTransactions } from '@/actions/transactions'

/**
 * @description Get all transactions for a user
 * @param req (SearchParams : page, rows, recent, search, status)
 * @returns
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pageParam = searchParams.get('page')
  const rowsParam = searchParams.get('rows')
  const recentParam = searchParams.get('recent')

  try {
    const params = {
      page: pageParam ? parseInt(pageParam, 10) : undefined,
      rows: rowsParam ? parseInt(rowsParam, 10) : undefined,
      recent: recentParam === 'true'
    }

    // If no parameters provided, get all transactions (no pagination)
    const result = await getTransactions(params)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Error fetching transactions:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
