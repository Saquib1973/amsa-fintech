import { UserService } from '@/services/backend/user-service'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userService = new UserService()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    // check if user is super admin
    try {
      if (!(await userService.isSuperAdmin(session.user.id))) {
        return NextResponse.json(
          { error: 'Not authorized' },
          { status: 403 }
        )
      }
    } catch (error) {
      console.error('Error checking super admin status:', error)
      return NextResponse.json(
        { error: 'Failed to verify admin status' },
        { status: 500 }
      )
    }

    // get user data
    try {
      const user = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          type: true,
          isVerified: true,
        },
      })
      return NextResponse.json({ user })
    } catch (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }


  } catch (error) {
    console.error('Error in users route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
