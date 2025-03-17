import React from 'react'
import PrimaryButton from '../button/primary-button'
import { Check, Fast, Safe } from '@/public/svg'
const HeroSection = () => {
  return (
    <div className="w-full h-full relative border bg-gradient-to-t from-blue-50 via-white to-white border-gray-200 p-2 md:p-6">
      <div className="flex justify-between p-6 md:p-10 py-10 md:py-16 max-w-[1400px] mx-auto w-full ">
        <div className="flex items-start justify-start flex-col gap-4 z-10">
          <h1 className="text-7xl md:text-8xl max-w-[80%] font-semibold">
            The
            <span className="italic px-4">joy</span>
            of financial freedom.
          </h1>
          <p className="text-xl text-gray-500">Less cryptic, more crypto</p>
          <PrimaryButton className="mt-4">Get Started</PrimaryButton>
          <div className="mt-16 flex gap-5 xl:gap-10 justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <Fast className="size-10 lg:size-20 text-gray-400" />
              <span className="text-3xl font-bold">Fast</span>
              <span className="text-gray-500 text-sm text-center lg:text-lg">
                Easily buy, sell and store crypto
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Check className="size-10 lg:size-20 text-gray-400" />
              <span className="text-3xl font-bold">Simple</span>
              <span className="text-gray-500 text-sm text-center lg:text-lg">
                Easily buy, sell and store crypto
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Safe className="size-10 lg:size-20 text-gray-400" />
              <span className="text-3xl font-bold">Simple</span>
              <span className="text-gray-500 text-sm text-center lg:text-lg">
                Easily buy, sell and store crypto
              </span>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2  top-0 max-w-[1600px] mx-auto w-full h-full bg-gray-50/50">
        {' '}
      </div>
    </div>
  )
}

export default HeroSection
