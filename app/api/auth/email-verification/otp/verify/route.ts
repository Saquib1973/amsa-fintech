import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(req: Request) {
  const { email, otp } = await req.json()
  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
  }
  const user = await prisma.user.findUnique({ where: { email },include: {otp: true} })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  if (!user.otp) {
    return NextResponse.json({ error: 'OTP not found' }, { status: 404 })
  }
  if (user.otp.token !== otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })
  }
  if (user.otp.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { userId: user.id } })
    return NextResponse.json({ error: 'OTP expired' }, { status: 401 })
  }
  await prisma.user.update({ where: { email }, data: { isVerified: true } })
  await prisma.verificationToken.delete({ where: { userId: user.id } })
  return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 })
}
