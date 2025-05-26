'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield } from 'lucide-react'

const CIRCUMFERENCE = 60 * Math.PI

const AuthCheckLoader = () => {
  const [step, setStep] = useState(0)

  const steps = [
    'Verifying credentials...',
    'Checking permissions...',
    'Setting up your session...',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-8 max-w-sm text-center relative">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 96, height: 96 }}
        >
          <motion.div
            className="absolute left-0 top-0 w-24 h-24 rounded-full"
            animate={{ opacity: [0.18, 0.28, 0.18], scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.svg
            width={96}
            height={96}
            viewBox="0 0 120 120"
            className="absolute left-0 top-0"
            style={{ zIndex: 2 }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          >
            <motion.circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="url(#loader-gradient)"
              strokeWidth="6"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * 0.7}
              strokeLinecap="round"
              initial={{ opacity: 0.7 }}
              animate={{
                opacity: [0.7, 1, 0.7],
                strokeDashoffset: [CIRCUMFERENCE * 0.7, CIRCUMFERENCE * 0.3, CIRCUMFERENCE * 0.7],
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient
                id="loader-gradient"
                x1="0"
                y1="0"
                x2="120"
                y2="120"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </motion.svg>
          <motion.div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center shadow-sm">
              <motion.div>
                <Shield className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            className="text-lg font-light text-gray-600 min-h-[20px]"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {steps[step]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AuthCheckLoader
