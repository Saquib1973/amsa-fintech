import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession, Session } from 'next-auth'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            accounts: {
              where: {
                provider: 'credentials',
                providerAccountId: credentials.email,
              },
            },
          },
        })

        if (!user || !user.accounts[0]?.password) return null

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.accounts[0].password
        )
        if (!isValidPassword) return null

        return user
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }: { session: Session }) {
      // ✅ Explicitly typed session
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (dbUser) {
          session.user.id = dbUser.id
        }
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
}

export const getSession = async () => {
  const session = await getServerSession(authOptions)
  return session
}
