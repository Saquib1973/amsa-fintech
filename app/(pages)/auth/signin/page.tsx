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
import TestCredentialsOptions from '@/components/auth/test-credentials-options'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const error = searchParams.get('error')
  const isFormDisabled = status === 'loading' || status === 'success'
  const handleSubmit = async (e: React.FormEvent) => {
    setStatus('loading')
    e.preventDefault()

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setStatus('error')
        toast.error(result.error)
      } else {
        setStatus('success')
        toast.success('Signed in successfully')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setStatus('error')
      console.error('Sign in error:', error)
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    setStatus('loading')
    try {
      await signIn('google', { callbackUrl })
      setStatus('success')
      toast.success('Signed in successfully')
    } catch (error) {
      setStatus('error')
      console.error('Google sign in error:', error)
      toast.error('Failed to sign in with Google')
    }
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
              disabled={isFormDisabled}
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
              disabled={isFormDisabled}
            />
          </div>

          <PrimaryButton
            type="submit"
            className={`w-full text-center h-12 flex items-center justify-center mt-6 ${status === 'success' ? 'bg-green-600 hover:bg-green-600' : ''}`}
            disabled={isFormDisabled}
          >
            {status === 'loading' ? (
              <Loader
                size="sm"
                message="Signing in..."
                className="text-white flex-row flex-1 justify-center gap-2"
              />
            ) : status === 'success' ? (
              <div className="flex items-center gap-2 text-white">
                <CheckCircle className="text-white size-5" /> Logged In
              </div>
            ) : (
              'Sign In'
            )}
          </PrimaryButton>

          <div className="flex items-center justify-between mt-2 gap-2">
            <TestCredentialsOptions
              onSelectCredentials={(credentials) => {
                setEmail(credentials.email)
                setPassword(credentials.password)
              }}
            />
            <button
              type="button"
              className="text-primary-main text-sm underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                router.push('/auth/forgot-password')
              }}
              disabled={isFormDisabled}
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

        <SecondaryButton
          onClick={handleGoogleSignIn}
          disabled={isFormDisabled}
          className="flex items-center justify-center w-full gap-2"
        >
          <Image
            src="/images/google-logo.webp"
            className="p-1 rounded-full"
            alt="Google"
            width={30}
            height={30}
          />
          <span>Sign in with Google</span>
        </SecondaryButton>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-primary-main hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AnimateWrapper>
  )
}
