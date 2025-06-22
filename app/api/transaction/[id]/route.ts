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
