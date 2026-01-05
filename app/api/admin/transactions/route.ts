import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * @description Get all transactions for admin (all users)
 * @returns All transactions across the platform
 */
export async function GET() {
  try {
    const session = await getSession()
    
    // Check if user is logged in
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 })
    }

    // Get user from database to check role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { type: true }
    })

    // Check if user is admin or super admin
    if (!user || (user.type !== 'ADMIN' && user.type !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    // Fetch all transactions (no user filter)
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        cryptoCurrency: true,
        fiatAmount: true,
        fiatCurrency: true,
        isBuyOrSell: true,
        status: true,
        createdAt: true,
        network: true,
      },
    })

    return NextResponse.json(transactions)
  } catch (err) {
    console.error('Error fetching admin transactions:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
