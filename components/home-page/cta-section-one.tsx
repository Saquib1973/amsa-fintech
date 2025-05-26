"use client"
import PrimaryButton from '../button/primary-button'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: 'easeOut',
      staggerChildren: 0.4,
    },
  },
}

const child = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const CtaSectionOne = () => {
  return (
    <div className="w-full h-full flex relative bg-white">
      <div className="flex max-md:flex-col gap-4 justify-between max-w-[1400px] p-10 md:p-24 mx-auto w-full">
        <motion.h1
          className="text-5xl md:text-6xl font-light md:w-1/2"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          Trade 440+ cryptocurrencies
        </motion.h1>
        <motion.div
          className="flex flex-col items-start justify-center gap-2 md:w-1/2"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h1
            className="md:text-lg font-light leading-5"
            variants={child}
          >
            Buy, sell, swap, track and analyse hundreds of cryptocurrencies on
            Australia’s most trusted crypto exchange
          </motion.h1>
          <motion.div
            className="mt-4"
            variants={child}
          >
            <PrimaryButton link="/assets">View All Assets</PrimaryButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default CtaSectionOne
