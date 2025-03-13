'use client'

import SecondaryButton from '@/components/button/secondary-button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (res?.ok) router.push('/dashboard')
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto items-center justify-center h-screen">
      <h2 className="text-4xl mb-8">Sign In</h2>
      <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
        />

        <SecondaryButton type="submit" className="w-full text-center flex items-center justify-center mt-6">
          Sign In
        </SecondaryButton>
      </form>
      <div className='flex items-center w-full mt-6 justify-center gap-2'>
        <div className='h-0.5 w-full bg-gray-200' />
        <span className='text-gray-500 text-lg md:text-xl font-semibold'>Or</span>
        <div className='h-0.5 w-full bg-gray-200' />
      </div>
      <SecondaryButton
        onClick={() => signIn('google')}
        className="bg-red-500 border-red-800 hover:bg-red-500 text-white p-2 px-6 mt-4"
      >
        Sign in with Google
      </SecondaryButton>
      <p className="mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="hover:underline text-blue-500">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
