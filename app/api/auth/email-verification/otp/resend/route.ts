import { generateOTP } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { OTP_EXPIRATION_TIME } from '../../../constants'


export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { otp: true }
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

    if (user.otp) {
      return NextResponse.json(
        { error: 'OTP already sent,please wait 1 minute before requesting a new one' },
        { status: 400 }
      )
    }

    const otp = generateOTP()
    const now = new Date()

    // Update or create new OTP
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

    // Send new verification email
    const emailResult = await sendVerificationEmail(email, user.name || '', otp)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    // Schedule OTP deletion
    setTimeout(async () => {
      await prisma.verificationToken.deleteMany({
        where: {
          userId: user.id,
          expires: { lte: new Date() }
        }
      }).catch(() => {
        // Ignore error if token is already deleted
      })
    }, OTP_EXPIRATION_TIME)

    return NextResponse.json({
      message: 'New OTP sent successfully'
    })
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Error sending new OTP' },
      { status: 500 }
    )
  }
}