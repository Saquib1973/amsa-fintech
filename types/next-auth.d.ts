import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role?: string
      // Add any other properties you need
    }
  }
  
  interface JWT {
    id: string
    role?: string
  }
}
