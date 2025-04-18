import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {  NextResponse } from "next/server";

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      sessions: true,
    },
  })
  return NextResponse.json({ message: 'Hello, world!', user })
}
