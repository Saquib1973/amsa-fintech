import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = await getToken({ req: request })
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      expires: 'desc',
    },
  })

  // Mark current session
  const currentSessionToken = token.sessionToken
  const sessionsWithCurrent = sessions.map(s => ({
    ...s,
    current: s.sessionToken === currentSessionToken
  }))

  return NextResponse.json({ sessions: sessionsWithCurrent })
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
  }

  const targetSession = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  if (!targetSession || targetSession.userId !== session.user.id) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  await prisma.session.delete({
    where: { id: sessionId },
  })

  return NextResponse.json({ message: 'Session revoked successfully' })
}
