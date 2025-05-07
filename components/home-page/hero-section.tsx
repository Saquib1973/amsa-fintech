'use client'
import { useSession } from 'next-auth/react'
import PrimaryButton from '../button/primary-button'
import Typewritter from '../typewritter'
const HeroSection = () => {
  const { data: session } = useSession()
  return (
    <div
      className="w-full h-full relative bg-cover bg-center bg-gradient-to-b from-surface-alt via-surface-main to-off-white p-2 md:p-6"
      style={{
        backgroundImage: 'url(/images/herobg.png)',
      }}
    >
      <div className="flex gap-4 justify-between p-6 md:p-10 py-20 max-2xl:min-h-[66vh] 2xl:py-52 md:py-32 max-w-[1200px] mx-auto w-full ">
        <div className="flex items-start justify-start flex-col gap-4 z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-semibold">
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
          </h1>
          <p className="text-xl text-gray-100">Less cryptic, more crypto</p>
          <PrimaryButton
            className="mt-4"
            link={session ? '/dashboard' : '/auth/signup'}
          >
            {session ? 'Dashboard' : 'Get Started'}
          </PrimaryButton>
        </div>
        <div className="relative"></div>
      </div>
    </div>
  )
}

export default HeroSection
