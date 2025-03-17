'use client'
import React, { useState, useEffect } from 'react'

const features = [
  {
    title: 'Sign up for free',
    image: '/images/buy-crypto-in-minutes.png',
  },
  {
    title: 'Verify your account',
    image: '/images/buy-crypto-in-minutes.png',
  },
  {
    title: 'Start investing',
    image: '/images/buy-crypto-in-minutes.png',
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
    <div className="w-full h-full flex relative border border-gray-200 bg-white">
      <div className="flex max-md:flex-col justify-between max-w-[1400px] mx-auto w-full">
        <div className="p-10 md:p-24 md:border-r border-gray-200 w-full md:w-1/2 h-full">
          <div className="relative p-4 w-full h-full">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`absolute w-full bg-gray-100 inset-0 transition-opacity duration-500 ${
                  index === isActive - 1 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-10 md:p-24 md:w-1/2 h-full">
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
                    index === isActive - 1
                      ? 'bg-blue-400 text-white'
                      : ''
                  }`}
                >
                  <span className="text-xl">{feature.title}</span>
                </button>
                <div className={`relative h-1 ${index===isActive-1 ? "bg-blue-400":""} overflow-hidden`}>
                  <div
                    className="absolute top-0 left-0 h-full bg-red-400 transition-all duration-100 ease-linear"
                    style={{
                      width: `${index === isActive - 1 ? progress : 0}%`,
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
