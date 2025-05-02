// auth.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getServerSession } from 'next-auth/next'
import { getClientIpAddress } from '@/lib/ip'

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: {
      emailVerified?: Date | null
      name?: string | null
      email?: string | null
      image?: string | null
    }) => {
      const userData = {
        name: data.name,
        email: data.email,
        image: data.image,
        isVerified: true,
      }
      return prisma.user.create({
        data: userData,
      })
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            accounts: {
              where: {
                provider: 'credentials',
              },
            },
            wallets: true,
          },
        })

        if (!user) {
          throw new Error('No user found with this email')
        } else if (!user.accounts[0]?.password) {
          throw new Error('Invalid credentials')
        } else if (!user.isVerified) {
          throw new Error('Please verify your email to sign in')
        }
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.accounts[0].password
        )

        if (!isValidPassword) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          isVerified: true,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        console.log(`User ${user.email} signed in with Google`)

        // Update user to be verified
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true },
        })

        const customer = await prisma.user.findUnique({
          where: { id: user.id },
          include: { wallets: true },
        })

        if (!customer?.wallets.length) {
          await prisma.wallet.create({
            data: {
              balance: 100,
              userId: user.id,
            },
          })
        }
      }

      // Create new session
      await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: crypto.randomUUID(),
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          location: await getClientIpAddress(),
        },
      })
    },
    async signOut({ token }) {
      if (token?.id) {
        // Delete all sessions for the user
        await prisma.session.deleteMany({
          where: {
            userId: token.id as string,
          },
        })
      }
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}

export const getSession = async () => {
  const session = await getServerSession(authOptions)
  return session
}

// export const saveSession = async (session: Session) => {
//   await prisma.session.create({
//     data: {
//       sessionToken: session.sessionToken,
//       userId: session.user.id,
//       expires: session.expires,
//       location: session.location,
//     },
//   })
// }

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}
export async function sendVerificationEmail(email: string, name: string) {
  const response = await fetch('/api/auth/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  })

  if (!response.ok) {
    throw new Error('Failed to send verification email')
  }

  return response.json()
}

