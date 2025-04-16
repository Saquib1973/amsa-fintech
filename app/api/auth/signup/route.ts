import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/email'
import { generateOTP } from '@/lib/auth'
import { OTP_EXPIRATION_TIME, USER_DELETION_TIME } from '../constants'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { otp: true }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOTP()
    const now = new Date()

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          isVerified: false,
          accounts: {
            create: {
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: email,
              password: hashedPassword,
            },
          },
          wallets: {
            create: {
              balance: 100,
            },
          },
        },
      })

      // Create OTP token
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token: otp,
          expires: new Date(now.getTime() + OTP_EXPIRATION_TIME),
          userId: newUser.id,
        },
      })

      return newUser
    })

    const emailResult = await sendVerificationEmail(email, name, otp)

    if (!emailResult.success) {
      await prisma.user.delete({ where: { id: user.id } })
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    setTimeout(async () => {
      const userCheck = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isVerified: true }
      })

      if (!userCheck?.isVerified) {
        await prisma.user.delete({ where: { id: user.id } })
      }
    }, USER_DELETION_TIME)

    setTimeout(async () => {
      await prisma.verificationToken.deleteMany({
        where: {
          userId: user.id,
          expires: { lte: new Date() }
        }
      }).catch(() => {
      })
    }, OTP_EXPIRATION_TIME)

    return NextResponse.json(
      {
        message: 'User created. Please verify your email within 30 seconds.',
        id: user.id,
        email: user.email,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}
