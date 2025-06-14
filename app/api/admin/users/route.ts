import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is super admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.type !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all users with basic information
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ user: users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
