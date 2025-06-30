'use client'

import SecondaryButton from '@/components/button/secondary-button'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Loader from '@/components/loader-component'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import PrimaryButton from '@/components/button/primary-button'
import Image from 'next/image'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const isFormDisabled = status === 'loading' || status === 'success'
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await toast.promise(
        fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }).then((res) => {
          if (res.ok) {
            setStatus('success')
            router.push(`/auth/verify-email?email=${email}`)
            return res
          } else {
            setStatus('error')
            throw new Error('Failed to sign up')
          }
        }),
        {
          loading: 'Registering...',
          success: 'Registered successfully',
          error: 'Failed to register',
        }
      )
    } catch (error) {
      setStatus('error')
      console.error('Signup error:', error)
    }
  }

  return (
    <AnimateWrapper>
      <div className="flex flex-col max-w-lg mx-auto items-center justify-center p-6 py-16">
        <h2 className="text-4xl font-bold mb-8">Sign Up</h2>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-field w-full"
              required
              disabled={isFormDisabled}
            />
          </div>

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
            className="w-full text-center h-12 flex items-center justify-center mt-6"
            disabled={isFormDisabled}
          >
            {status === 'loading' ? (
              <Loader
                size="sm"
                message="Registering..."
                className="text-white flex-row justify-center gap-2"
              />
            ) : status === 'success' ? (
              <div className="flex items-center gap-2">
                <svg className="text-green-700" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4 -4" /></svg> Registered
              </div>
            ) : (
              'Sign Up'
            )}
          </PrimaryButton>
        </form>

        <div className="flex items-center w-full my-6 justify-center gap-2">
          <div className="h-px w-full bg-gray-200" />
          <span className="text-gray-500 text-sm font-medium px-2">OR</span>
          <div className="h-px w-full bg-gray-200" />
        </div>

        <SecondaryButton
          onClick={() => signIn('google')}
          disabled={isFormDisabled}
          className="flex items-center justify-center w-full gap-2"
        >
          <Image src="/images/google-logo.webp" className='p-1 rounded-full' alt="Google" width={30} height={30} />
          <span>Sign up with Google</span>
        </SecondaryButton>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary-main hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AnimateWrapper>
  )
}
