"use client"
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
const AnimateWrapper = ({ children,animateVertical = false,duration = 0.9,delay = 0,className = '' }: { children: React.ReactNode,animateVertical?: boolean,duration?: number,delay?: number,className?: string }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: animateVertical ? 10 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: duration, delay: delay, }}
        viewport={{ once: true }}
        exit={{ opacity: 0, y: animateVertical ? -10 : 0 }}
        className={cn('w-full',className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimateWrapper
