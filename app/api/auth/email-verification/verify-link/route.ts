import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { USER_DELETION_TIME } from '../../constants'
const getErrorTemplate = (title: string) => `<!DOCTYPE html>
<html lang="en" class="overflow-hidden">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta http-equiv="refresh" content="5;url=/">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        display: flex;
        font-family: sans-serif;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background-color: #ef4444;
        color: white;
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        text-align: center;
      }
      .message {
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.4;
      }
      .redirect {
        font-size: 0.875rem;
        opacity: 0.9;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <h1 class="message">${title}</h1>
      <p class="redirect">Redirecting to home page...</p>
    </div>
  </body>
</html>`

const getSuccessTemplate = () => `<!DOCTYPE html>
<html lang="en" class="overflow-hidden">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified</title>
    <meta http-equiv="refresh" content="5;url=/auth/signin">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        display: flex;
        font-family: sans-serif;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background-color: #10b981;
        color: white;
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        text-align: center;
      }
      .message {
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.4;
      }
      .redirect {
        font-size: 0.875rem;
        opacity: 0.9;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <h1 class="message">Email Verified Successfully!</h1>
      <p class="redirect">Redirecting to login page...</p>
    </div>
  </body>
</html>`

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const email = searchParams.get('email')
  const secret = searchParams.get('secret')
  const timestamp = searchParams.get('timestamp')

  if (!email || !secret || !timestamp) {
    return new NextResponse(getErrorTemplate('Invalid URL'), {
      headers: { 'Content-Type': 'text/html' },
      status: 400
    })
  }

  // Check if the link has expired
  const currentTime = Date.now();
  const linkAge = currentTime - parseInt(timestamp);
  if (linkAge > USER_DELETION_TIME) {
    return new NextResponse(getErrorTemplate('Verification link has expired'), {
      headers: { 'Content-Type': 'text/html' },
      status: 400
    })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return new NextResponse(getErrorTemplate('Invalid URL'), {
      headers: { 'Content-Type': 'text/html' },
      status: 404
    })
  }
  if(user.isVerified) {
    return new NextResponse(getErrorTemplate('Email already verified'), {
      headers: { 'Content-Type': 'text/html' },
      status: 400
    })
  }

  if (!process.env.UNIVERSAL_SECRET) {
    return new NextResponse(getErrorTemplate('Server Error'), {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    })
  }

  const dataToVerify = `${email}${process.env.UNIVERSAL_SECRET}${timestamp}`;
  const isSecretValid = await bcrypt.compare(dataToVerify, secret)

  if (!isSecretValid) {
    return new NextResponse(getErrorTemplate('Not Authorized'), {
      headers: { 'Content-Type': 'text/html' },
      status: 401
    })
  }

  await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  })

  return new NextResponse(getSuccessTemplate(), {
    headers: { 'Content-Type': 'text/html' },
    status: 200
  })
}
