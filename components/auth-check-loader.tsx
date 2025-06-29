'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  const paperWithScanner = (
    <motion.svg
      width="260"
      height="260"
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block mx-auto"
    >
      <rect
        x="60"
        y="75"
        width="140"
        height="110"
        rx="18"
        className="fill-gray-50"
      />
      <circle cx="90" cy="105" r="18" className="fill-blue-200" />
      <circle cx="90" cy="102" r="7.5" className="fill-white" />
      <rect x="82" y="112" width="15" height="3" rx="1.5" className="fill-white" />
      <rect x="120" y="98" width="56" height="12" rx="3" className="fill-blue-100/60" />
      <rect x="82" y="135" width="98" height="15" rx="5" className="fill-blue-100/40" />
      <rect x="82" y="158" width="70" height="11" rx="4" className="fill-blue-100/30" />
      <rect x="82" y="175" width="84" height="11" rx="4" className="fill-blue-100/20" />
      <foreignObject x="60" y="75" width="140" height="110">
        <motion.div
          className="absolute left-0 w-full h-2 bg-blue-300 opacity-60"
          initial={{ y: 0 }}
          animate={{ y: [0, 100, 0] }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      </foreignObject>
    </motion.svg>
  )

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: [0, -2, 0], opacity: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {paperWithScanner}
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            className="text-xl font-light tracking-tight"
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
