import { generateOTP } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { OTP_EXPIRATION_TIME } from '../../constants'

export async function POST(req: Request) {
  const { name, email } = await req.json()
  const otp = generateOTP()

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })
      if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'User is already verified' },
        { status: 400 }
      )
    }

    const now = new Date()

    await prisma.verificationToken.upsert({
      where: { userId: user.id },
      create: {
        identifier: email,
        token: otp,
        expires: new Date(now.getTime() + OTP_EXPIRATION_TIME),
        userId: user.id
      },
      update: {
        token: otp,
        expires: new Date(now.getTime() + OTP_EXPIRATION_TIME)
      }
    })

    const emailResult = await sendVerificationEmail(email, user.name || '', otp)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    setTimeout(async () => {
      await prisma.verificationToken.deleteMany({
        where: {
          userId: user.id,
          expires: { lte: new Date() }
        }
      }).catch(() => {
      })
    }, OTP_EXPIRATION_TIME)

    return NextResponse.json({
      message: 'New OTP sent successfully'
    })
}
