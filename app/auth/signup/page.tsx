'use client'

import SecondaryButton from '@/components/button/secondary-button'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.promise(
      new Promise((resolve, reject) => {
        fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }).then((res) => {
          if (res.ok) {
            resolve(res)
            router.push(`/auth/verify-email?email=${email}`)
          } else {
            throw new Error('Failed to sign up')
          }
        }).catch((err) => {
          reject(err)
        })
      }),
      {
        loading: 'Registering...',
        success: 'Registered successfully',
        error: 'Failed to register',
      }
    )
  }

  return (
    <AnimateWrapper>
      <div className="flex flex-col p-8 py-16 max-w-lg mx-auto items-center justify-center">
        <h2 className="text-4xl mb-8">Sign Up</h2>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col space-y-3"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input-field"
          />
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

          <SecondaryButton
            type="submit"
            className="w-full text-center flex items-center justify-center mt-6"
          >
            Sign Up
          </SecondaryButton>
        </form>
        <div className="flex items-center w-full my-6 justify-center gap-2">
          <div className="h-px w-full bg-gray-200" />
          <span className="text-gray-500 text-sm font-medium px-2">OR</span>
          <div className="h-px w-full bg-gray-200" />
        </div>
        <SecondaryButton
          onClick={() => signIn('google')}
          className="flex items-center justify-center w-full gap-2 bg-blue-400 text-white"
        >
          Sign up with Google
        </SecondaryButton>
        <p className="mt-4">
          Already have an account?{' '}
          <Link href="/auth/signin" className="hover:underline text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </AnimateWrapper>
  )
}
