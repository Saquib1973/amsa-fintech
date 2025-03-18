import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const publicPaths = ['/auth/signin', '/auth/signup', '/']
  const isPublicPath = publicPaths.includes(path)

  const isAuthPath = path.startsWith('/auth')

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  if (isAuthPath && token && !path.includes('/signout')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
