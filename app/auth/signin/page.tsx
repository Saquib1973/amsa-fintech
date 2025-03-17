'use client'

import SecondaryButton from '@/components/button/secondary-button'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    toast.promise(
      new Promise((resolve, reject) => {
        signIn('credentials', {
          email,
          password,
          redirect: false,
        }).then((res) => {
          if (res?.error) {
            setError('Invalid email or password')
            reject(res.error)
          } else if (res?.ok) {
            resolve(res)
            router.push('/dashboard')
          }
        })
      }),
      {
        loading: 'Signing in...',
        success: 'Signed in successfully',
        error: 'Failed to sign in',
      }
    )
  }

  const handleGoogleSignIn = async () => {
    setError('')
    const response = await signIn('google', { redirect: false })
    if (response?.error) {
      setError('Failed to sign in with Google')
    } else {
      router.push('/dashboard')
    }
  }

  const testCredentials = {
    email: 'saquibali353@gmail.com',
    password: 'saban1973',
  }

  return (
    <AnimateWrapper>
    <div className="flex flex-col max-w-lg mx-auto items-center justify-center h-screen">
      <h2 className="text-4xl mb-8">Sign In</h2>
      {error && (
        <div className="text-center text-lg text-red-500 mb-4 w-full">
          {error}
        </div>
      )}
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

          <button className='lowercase text-blue-500 ml-auto text-lg hover:underline cursor-pointer' onClick={(e) => {
            e.preventDefault()
            setEmail(testCredentials.email)
            setPassword(testCredentials.password)
          }}
          >Use Test Credentials</button>
      </form>
      <div className='flex items-center w-full mt-6 justify-center gap-2'>
        <div className='h-0.5 w-full bg-gray-200' />
        <span className='text-gray-500 text-lg md:text-xl font-semibold'>Or</span>
        <div className='h-0.5 w-full bg-gray-200' />
      </div>
      <SecondaryButton
        onClick={handleGoogleSignIn}
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
    </AnimateWrapper>
  )
}
