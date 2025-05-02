"use client"
import React from 'react'
import AnimateWrapper from './wrapper/animate-wrapper'
import SecondaryButton from './button/secondary-button'
import StillBuildingPage from './still-building-page'
import { motion } from 'framer-motion'

const GlitchText = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <motion.div
        animate={{
          x: [-2, 2, -2],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
        className="absolute text-red-500 left-0 top-0"
      >
        {children}
      </motion.div>
      <motion.div
        animate={{
          x: [2, -2, 2],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
        className="absolute text-cyan-500 left-0 top-0"
      >
        {children}
      </motion.div>
      <div>{children}</div>
    </div>
  )
}

const ErrorPage = ({
  error = null,
  building = null,
}: {
  error?: boolean | null
  building?: boolean | null
}) => {
  if (error || building === null) {
    return (
      <AnimateWrapper>
        <div className="page-container min-h-screen overflow-hidden">
          <motion.div
            className='absolute -z-10 flex max-md:flex-col left-0 top-0 w-full h-full'
            animate={{
              y: [-10, 0, -5],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <div className='md:w-1/7 w-full h-1/7 md:h-full bg-white' />
            <div className='md:w-1/7 w-full h-1/7 md:h-full bg-yellow-400' />
            <div className='md:w-1/7 w-full h-1/7 md:h-full bg-cyan-400' />
            <div className='md:w-1/7 w-full h-1/7 md:h-full bg-green-400' />
            <div className='md:w-1/7 w-full h-1/7 md:h-full bg-pink-400' />
            <div className='md:w-1/7 w-full h-1/7 md:h-full bg-red-400' />
            <div className='md:w-1/7 w-full h-1/7 md:h-full bg-blue-400' />
          </motion.div>

          <div className="flex flex-col items-center p-10 justify-center gap-6 relative">
            <motion.div
              animate={{
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 bg-black/10 h-screen backdrop-blur-sm"
            />

            <div className="relative z-10 py-5 md:py-10">
              <GlitchText>
                <h1 className="text-4xl font-mono font-bold text-gray-900 uppercase tracking-wider">
                  OOPS
                  <span className='text-primary-main'> 404 </span>
                  NO SIGNAL!
                </h1>
              </GlitchText>

              <motion.p
                className="text-gray-600 text-lg mt-4 text-center"
                animate={{
                  x: [-1, 1, -1],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                The page you&apos;re looking for doesn&apos;t exist.
              </motion.p>

              <div className="mt-6 flex justify-center">
                <SecondaryButton link="/" className="relative z-10">
                  Return to Home
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </AnimateWrapper>
    )
  } else if (building) {
    return <StillBuildingPage />
  }
}

export default ErrorPage
