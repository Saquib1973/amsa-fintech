'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const features = [
  {
    title: 'Sign up for free',
    image: '/images/cta-two.png',
  },
  {
    title: 'Verify your account',
    image: '/images/navbar-image.png',
  },
  {
    title: 'Start investing',
    image: '/images/cta-two.png',
  },
  {
    title: 'API Documentation',
    image: '/images/assets-search.png',
  },
]

const AboutUsSection = () => {
  const [isActive, setIsActive] = useState(1)
  const [progress, setProgress] = useState(0)
  const INTERVAL = 4000

  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / INTERVAL) * 100)
      setProgress(progress)

      if (elapsed >= INTERVAL) {
        setIsActive((prev) => (prev === features.length ? 1 : prev + 1))
        setProgress(0)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="w-full h-full flex relative">
      <div className="flex max-md:flex-col justify-between max-w-[1400px] mx-auto w-full">
        <div className="p-10 xl:p-24 w-full md:w-1/2 h-full">
          <div className="relative p-10 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={features[isActive - 1].title}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full bg-gray-50 max-md:h-[300px] max-md:-translate-y-4 inset-0 flex items-center justify-center"
              >
                <Image
                  width={1000}
                  height={1000}
                  src={features[isActive - 1].image}
                  alt={features[isActive - 1].title}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="p-10 xl:p-24 md:w-1/2 h-full">
          <h1 className="text-6xl font-light mb-10">
            Buy crypto in
            <br />
            <span className="italic">minutes</span>
          </h1>
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div key={feature.title} className="w-[80%]">
                <button
                  onClick={() => {
                    setIsActive(index + 1)
                    setProgress(0)
                  }}
                  className={`w-full cursor-pointer flex items-center h-20 px-6 transition-colors duration-200 ${
                    index === isActive - 1 ? 'bg-primary-main text-white' : ''
                  }`}
                >
                  <span className="text-2xl font-light">{feature.title}</span>
                </button>
                <div
                  className={`relative h-1 ${index === isActive - 1 ? 'bg-primary-main' : ''} overflow-hidden`}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100 ease-linear"
                    style={{
                      width: `${index === isActive - 1 ? progress + 8 : 0}%`, // 5 is a padding for improved user experience
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsSection
