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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const rows = parseInt(searchParams.get('rows') || '20', 10)

    // Fetch user and transactions
    const [user, transactions, total] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * rows,
        take: rows,
      }),
      prisma.transaction.count({
        where: { userId }
      })
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user,
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / rows)
    })
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
