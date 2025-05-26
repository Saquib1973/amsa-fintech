'use client'
import { useSession } from 'next-auth/react'
import PrimaryButton from '../button/primary-button'
import Typewritter from '../typewritter'
import { motion } from 'framer-motion'
const HeroSection = () => {
  const { data: session, status } = useSession()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full h-full relative bg-cover bg-center bg-gradient-to-b from-surface-alt via-surface-main to-off-white p-2 md:p-6"
      style={{
        backgroundImage: 'url(/images/herobg.png)',
      }}
    >
      <div className="flex gap-4 justify-between p-6 md:p-10 py-32 max-2xl:min-h-[66vh] 2xl:py-60 md:py-40 max-w-[1200px] mx-auto w-full ">
        <div className="flex items-start justify-start flex-col gap-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-semibold"
          >
            The
            <span className="inline-block italic px-4 text-primary-main">
              <Typewritter
                textArray={['joy', 'freedom', 'success']}
                className="font-semibold"
                letterDelay={0.08}
                mainFadeDuration={0.5}
              />
            </span>
            of financial
            <span className="italic px-4">freedom.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl text-gray-100"
          >
            Less cryptic, more crypto
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <PrimaryButton
              className='w-[100px]'
              loading={status === 'loading'}
              link={session ? '/dashboard' : '/auth/signup'}
            >
              {session ? 'Dashboard' : 'Get Started'}
            </PrimaryButton>
          </motion.div>
        </div>
        <div className="relative"></div>
      </div>
    </motion.div>
  )
}

export default HeroSection
