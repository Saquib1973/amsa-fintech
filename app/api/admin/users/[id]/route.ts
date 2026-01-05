import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (admin?.type !== 'SUPER_ADMIN' && admin?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const params = await context.params
    const userId = params.id

    // Fetch user details with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        _count: {
          select: {
            transactions: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate metrics
    const transactions = user.transactions
    
    const totalSpent = transactions
      .filter((t) => t.isBuyOrSell === 'BUY')
      .reduce((sum, t) => sum + (t.fiatAmount || 0), 0)
    
    const totalReceived = transactions
      .filter((t) => t.isBuyOrSell === 'SELL')
      .reduce((sum, t) => sum + (t.fiatAmount || 0), 0)

    // Group transactions by month for chart
    const monthlyData: { [key: string]: { buy: number; sell: number } } = {}
    transactions.forEach((t) => {
      const month = new Date(t.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
      if (!monthlyData[month]) {
        monthlyData[month] = { buy: 0, sell: 0 }
      }
      if (t.isBuyOrSell === 'BUY') {
        monthlyData[month].buy += t.fiatAmount || 0
      } else if (t.isBuyOrSell === 'SELL') {
        monthlyData[month].sell += t.fiatAmount || 0
      }
    })

    // Group by crypto for pie chart
    const cryptoData: { [key: string]: number } = {}
    transactions.forEach((t) => {
      const crypto = t.cryptoCurrency || 'UNKNOWN'
      if (!cryptoData[crypto]) {
        cryptoData[crypto] = 0
      }
      cryptoData[crypto] += t.fiatAmount || 0
    })

    return NextResponse.json({
      user: {
        ...user,
        totalSpent,
        totalReceived,
      },
      analytics: {
        monthlyData,
        cryptoData,
      }
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    )
  }
}
