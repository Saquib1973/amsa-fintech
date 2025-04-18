'use client'
import PrimaryButton from '@/components/button/primary-button'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const toastId = toast.loading('Sending reset link...')

      if (!email) {
        toast.error('Email is required')
        return
      }
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        setIsSuccess(true)
        toast.success('Reset link sent to email', { id: toastId })
      } else {
        toast.error(data.error, { id: toastId })
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to send reset link')
    }
  }
  return (
    <AnimateWrapper>
      <motion.div className="flex flex-col items-center justify-center p-4 gap-4">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <>
              <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-3xl">Reset link sent to email</h1>
                <p className="text-gray-600 text-sm">
                  No worries, we&nbsp; will send you a link to reset password.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex p-4 max-w-md flex-col w-full items-center justify-center gap-4"
              >
                <input
                  placeholder="Email"
                  type="email"
                  className="input-field w-full"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PrimaryButton type="submit" className="w-full">
                  Reset Password
                </PrimaryButton>
              </form>
              <div className="flex items-center justify-center gap-2">
                <ArrowLeft className="size-4" />
                <Link href="/auth/signin" className="text-sm text-gray-600">
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-2"
            >
              <h1 className="text-3xl">Reset Link Sent</h1>
              <p className="text-gray-600 text-sm">
                We&nbsp; have sent you a link to reset password.
              </p>
              <Image
                src="/gif/email-sent.gif"
                alt="email"
                width={100}
                height={100}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimateWrapper>
  )
}

export default ForgotPasswordPage
