'use client'

import SecondaryButton from '@/components/button/secondary-button'
import PrimaryButton from '@/components/button/primary-button'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Loader from '@/components/loader-component'
export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const error = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      console.log(result)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Signed in successfully')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Google sign in error:', error)
      toast.error('Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  const testCredentials = {
    email: 'testuser@gmail.com',
    password: 'testuser',
  }

  return (
    <AnimateWrapper>
      <div className="flex flex-col max-w-lg mx-auto items-center justify-center p-6 py-16">
        <h2 className="text-4xl font-bold mb-8">Sign In</h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full"
            role="alert"
          >
            {error === 'CredentialsSignin'
              ? 'Invalid email or password'
              : 'An error occurred. Please try again.'}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field w-full"
              required
              disabled={isLoading}
            />
          </div>

          <SecondaryButton
            type="submit"
            className="w-full text-center h-12 flex items-center justify-center mt-6"
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" message="Signing in..." className="flex-row justify-center gap-2" /> : 'Sign In'}
          </SecondaryButton>

          <div className="flex items-center justify-between mt-2 gap-2">
            <button
              type="button"
            className="text-blue-500 text-sm hover:underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              setEmail(testCredentials.email)
              setPassword(testCredentials.password)
            }}
            disabled={isLoading}
          >
            Test Credentials
          </button>
          <button
            type="button"
            className="text-blue-500 text-sm underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              router.push('/auth/forgot-password')
            }}
            disabled={isLoading}
          >
            Forgot Passowrd?
          </button>
            </div>
        </form>

        <div className="flex items-center w-full my-6 justify-center gap-2">
          <div className="h-px w-full bg-gray-200" />
          <span className="text-gray-500 text-sm font-medium px-2">OR</span>
          <div className="h-px w-full bg-gray-200" />
        </div>

        <PrimaryButton
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex items-center justify-center w-full gap-2"
        >
          <span>Sign in with Google</span>
        </PrimaryButton>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </AnimateWrapper>
  )
}
