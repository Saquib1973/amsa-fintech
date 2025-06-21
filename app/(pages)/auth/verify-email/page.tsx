'use client'
import PrimaryButton from '@/components/button/primary-button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

const VerifyEmailPage = () => {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""])
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const handleChange = (index: number, value: string) => {
    if (!value.match(/^[0-9]*$/)) return
    const newOtpValues = [...otpValues]
    newOtpValues[index] = value
    setOtpValues(newOtpValues)
    if (index < 3 && value) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (otpValues[index]) {
        const newOtpValues = [...otpValues]
        newOtpValues[index] = ''
        setOtpValues(newOtpValues)
      }
      else if(index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleSubmit = async () => {
    const response = await fetch('/api/auth/email-verification/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp: otpValues.join('') }),
    })
    const data = await response.json()
    if (data?.error) {
      toast.error(data.error)
    }
    if (response.ok) {
      toast.success('Email verified successfully')
      router.push(callbackUrl)
    }
  }
  const handleResendOTP = async () => {
    const toastId = toast.loading('Sending OTP...')
    const response = await fetch('/api/auth/email-verification/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    if (response.ok) {
      toast.success('OTP sent successfully', { id: toastId })
    } else {
      toast.error('Failed to send OTP', { id: toastId })
    }
  }
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col gap-4 border border-gray-200 rounded-lg bg-gray-50 p-16">
        <h1 className="text-2xl font-bold">Verify Email</h1>
        <p className="text-gray-500">
          Enter the OTP sent to your email to verify your account.
        </p>
        <div className="flex gap-2 mb-4">
          {otpValues.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              ref={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref;
                }
              }}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="input-field p-0 w-12 h-12 text-center text-xl font-bold border rounded-xl focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
            />
          ))}
        </div>
        <PrimaryButton onClick={handleSubmit}>Verify</PrimaryButton>
        <button
          className="text-gray-500 cursor-pointer hover:underline hover:text-blue-400 text-sm mr-auto"
          onClick={handleResendOTP}
        >
          Resend OTP
        </button>
      </div>
    </div>
  )
}

export default VerifyEmailPage
