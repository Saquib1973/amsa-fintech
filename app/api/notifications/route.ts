import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the since parameter from the URL
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');

    // Build the where clause
    const where = {
      userId: session.user.id,
      ...(since ? {
        createdAt: {
          gt: new Date(since)
        }
      } : {})
    };

    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where,
      select: {
        id: true,
        type: true,
        message: true,
        link: true,
        createdAt: true,
        read: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}