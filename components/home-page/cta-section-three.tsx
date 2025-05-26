"use client"
import React from 'react'
import SectionWrapper from '../wrapper/section-wrapper'
import SecondaryButton from '../button/secondary-button'
import { motion } from 'framer-motion'

const CtaSectionThree = () => {
  return (
    <SectionWrapper>
      <div className="text-center text-6xl font-light">
        <motion.span
          initial={{ x: 40, skewX: 0, opacity: 0 }}
          whileInView={{ x: 0, skewX: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ display: 'inline-block' }}
        >
          The help you need,
        </motion.span>
        <br />
        <motion.span
          className="inline-block text-primary-main"
          initial={{ x: -24, skewX: 8, opacity: 0 }}
          whileInView={{ x: 0, skewX: -12, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ display: 'inline-block' }}
        >
          {' '}
          when you need it
        </motion.span>
      </div>
      <div className="flex justify-center mt-8">
        <SecondaryButton link="/assets">Explore Assets</SecondaryButton>
      </div>
    </SectionWrapper>
  )
}

export default CtaSectionThree
