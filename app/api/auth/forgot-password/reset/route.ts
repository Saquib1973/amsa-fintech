import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

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

const getPasswordFormTemplate = (
  email: string,
  secret: string,
  timestamp: string
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Set New Password</title>
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
        min-height: 100vh;
        background-color: #f3f4f6;
      }
      .form-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;
      }
      h1 {
        color: #1f2937;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #4b5563;
      }
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 1rem;
      }
      button {
        width: 100%;
        padding: 0.75rem;
        background-color: #60A5FA;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
      }
      button:hover {
        background-color: #3b82f6;
      }
      .error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
    </style>
  </head>
  <body>
    <div class="form-container">
      <h1>Set New Password</h1>
      <form id="resetForm" method="POST">
        <input type="hidden" name="email" value="${email}">
        <input type="hidden" name="secret" value="${secret}">
        <input type="hidden" name="timestamp" value="${timestamp}">
        <div class="form-group">
          <label for="password">New Password</label>
          <input type="password" id="password" name="password" required minlength="8">
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8">
        </div>
        <button type="submit">Update Password</button>
      </form>
    </div>
    <script>
      document.getElementById('resetForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        const formData = new FormData(e.target);
        try {
          const response = await fetch(window.location.href, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            window.location.href = '/auth/signin';
          } else {
            const data = await response.json();
            alert(data.error || 'Failed to update password');
          }
        } catch (error) {
          alert('An error occurred. Please try again.');
        }
      });
    </script>
  </body>
</html>`

const getSuccessTemplate = () => `<!DOCTYPE html>
<html lang="en" class="overflow-hidden">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
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
      <h1 class="message">Password Reset Successfully!</h1>
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
      status: 400,
    })
  }

  // Check if the link has expired (5 minutes)
  const currentTime = Date.now()
  const linkAge = currentTime - parseInt(timestamp)
  if (linkAge > 300000) {
    // 5 minutes in milliseconds
    return new NextResponse(getErrorTemplate('Reset link has expired'), {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return new NextResponse(getErrorTemplate('Invalid URL'), {
      headers: { 'Content-Type': 'text/html' },
      status: 404,
    })
  }

  if (!process.env.UNIVERSAL_SECRET) {
    return new NextResponse(getErrorTemplate('Server Error'), {
      headers: { 'Content-Type': 'text/html' },
      status: 500,
    })
  }

  const dataToVerify = `${email}${process.env.UNIVERSAL_SECRET}${timestamp}`
  const isSecretValid = await bcrypt.compare(dataToVerify, secret)

  if (!isSecretValid) {
    return new NextResponse(getErrorTemplate('Not Authorized'), {
      headers: { 'Content-Type': 'text/html' },
      status: 401,
    })
  }

  return new NextResponse(getPasswordFormTemplate(email, secret, timestamp), {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  })
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const email = formData.get('email') as string
  const secret = formData.get('secret') as string
  const timestamp = formData.get('timestamp') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !secret || !timestamp || !password || !confirmPassword) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: 'Passwords do not match' },
      { status: 400 }
    )
  }

  // Validate the reset link again
  const currentTime = Date.now()
  const linkAge = currentTime - parseInt(timestamp)
  if (linkAge > 300000) {
    // 5 minutes in milliseconds
    return NextResponse.json(
      { error: 'Reset link has expired' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (!process.env.UNIVERSAL_SECRET) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  const dataToVerify = `${email}${process.env.UNIVERSAL_SECRET}${timestamp}`
  const isSecretValid = await bcrypt.compare(dataToVerify, secret)

  if (!isSecretValid) {
    return NextResponse.json({ error: 'Invalid reset link' }, { status: 401 })
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: 'credentials',
    },
  })

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.account.update({
    where: { id: account.id },
    data: { password: hashedPassword },
  })

  return new NextResponse(getSuccessTemplate(), {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  })
}
