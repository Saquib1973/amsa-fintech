import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NotificationType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.type !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { message, type = NotificationType.SYSTEM_MESSAGE, link, userIds } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one user must be selected' },
        { status: 400 }
      )
    }

    // Create notifications in database for selected users
    const notifications = await Promise.all(
      userIds.map(userId =>
        prisma.notification.create({
          data: {
            userId,
            type,
            message,
            link,
            createdById: session.user.id,
          },
        })
      )
    )

    return NextResponse.json({ success: true, notifications })
  } catch (error) {
    console.error('Error broadcasting message:', error)
    return NextResponse.json(
      { error: 'Failed to broadcast message' },
      { status: 500 }
    )
  }
}