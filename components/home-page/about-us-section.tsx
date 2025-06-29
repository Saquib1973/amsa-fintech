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
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('down')
  const INTERVAL = 4000

  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / INTERVAL) * 100)
      setProgress(progress)

      if (elapsed >= INTERVAL) {
        setSlideDirection('down')
        setIsActive((prev) => (prev === features.length ? 1 : prev + 1))
        setProgress(0)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [isActive])

  const handleSlideChange = (newIndex: number) => {
    const currentIndex = isActive - 1
    const direction = newIndex > currentIndex ? 'down' : 'up'
    setSlideDirection(direction)
    setIsActive(newIndex + 1)
    setProgress(0)
  }

  return (
    <div className="w-full min-h-screen flex relative">
      <div className="flex max-md:flex-col justify-between max-w-[1400px] mx-auto w-full">
        <div className="p-10 py-2 xl:p-24 w-full md:w-1/2 md:h-full min-h-[400px] md:min-h-0">
          <div className="relative p-10 py-2 w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={features[isActive - 1].title}
                initial={{
                  opacity: 0,
                  y: slideDirection === 'down' ? -100 : 100
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: slideDirection === 'down' ? 100 : -100
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-full max-md:h-[300px] md:h-full inset-0 flex items-center justify-center"
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
        <div className="p-10 xl:p-24 md:w-1/2 md:h-full flex flex-col justify-center min-h-[400px] md:min-h-0">
          <h1 className="text-4xl md:text-6xl font-light mb-6 md:mb-10 relative z-10">
            Buy crypto in
            <br />
            <span className="italic">minutes</span>
          </h1>
          <div className="flex flex-col gap-4 relative z-10">
            {features.map((feature, index) => (
              <div key={feature.title} className="w-full md:w-[80%]">
                <button
                  onClick={() => handleSlideChange(index)}
                  className={`w-full cursor-pointer flex items-center h-16 md:h-20 px-4 md:px-6 transition-colors duration-200 ${
                    index === isActive - 1 ? 'bg-primary-main text-white' : ''
                  }`}
                >
                  <span className="text-lg md:text-2xl font-light">{feature.title}</span>
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
