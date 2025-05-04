'use client'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

const Typewritter = ({
  textArray,
  textSize = 'md',
  className,
  letterDelay = 0.025, // how much time to wait before the next letter
  mainFadeDuration = 0.25, // how much time the text will take to fade in
  fadeDelay = 5, //delay between two text
  boxFadeDuration = 0.125, // how much time the box will take to fade in
  swapDelayInMs = 5500, // after how many ms the text will be swapped
  cursor = false,
}: {
  textArray: string[]
  textSize?: 'lg' | 'md' | 'sm'
  className?: string
  letterDelay?: number
  mainFadeDuration?: number
  fadeDelay?: number
  boxFadeDuration?: number
  swapDelayInMs?: number
  cursor?: boolean
}) => {
  const [textIndex, setTextIndex] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % textArray.length)
    }, swapDelayInMs)
    return () => clearInterval(intervalId)
  }, [swapDelayInMs, textArray.length])
  const textSizeClass = {
    lg: 'text-lg',
    md: 'text-md',
    sm: 'text-sm',
  }

  return (
    <p
      className={cn(
        `mb-2.5 inline-block ${textSizeClass[textSize]} font-light uppercase`,
        className
      )}
    >
      {textArray[textIndex].split('').map((l, i) => (
        <motion.span
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 0,
          }}
          transition={{
            delay: fadeDelay,
            duration: mainFadeDuration,
            ease: 'easeInOut',
          }}
          key={`${textIndex}-${i}`}
          className="relative"
        >
          <motion.span
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: i * letterDelay,
              duration: 0,
              ease: 'easeInOut',
            }}
          >
            {l}
          </motion.span>
          {cursor && (
            <motion.span
              initial={{
                opacity: 0,
              }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: i * letterDelay,
              times: [0, 0.1, 1],
              duration: boxFadeDuration,
              ease: 'easeInOut',
            }}
              className="absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-primary-main"
            />
          )}
        </motion.span>
      ))}
    </p>
  )
}

export default Typewritter
