import React from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import SecondaryButton from './button/secondary-button'

const StillBuildingPage = () => {
  return (
    <AnimateWrapper className="">
      <SectionWrapper>
        <div
          style={{
            backgroundImage: 'url(/images/construction.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'white',
          }}
          className="page-container flex items-center justify-center relative"
        >
          <div className="mx-auto flex flex-col items-center justify-center gap-6">
            <h1 className="text-6xl text-center font-light z-50">
              We&apos;re still building
              <span className="italic block text-primary-main md:text-white relative md:p-10 md:py-4 ">
                <div className="absolute top-0 max-md:hidden bg-primary-main/90 -z-10 h-full w-full min-w-fit left-1/2 -translate-x-1/2 -skew-2" />
                something amazing
              </span>
            </h1>
            <p className="text-lg text-center z-50 text-gray-400 max-w-2xl mx-auto">
              This page is currently under development. We&apos;re working hard
              to bring you the best experience possible.
            </p>
            <div className="flex justify-center mt-8">
              <SecondaryButton link="/">Return Home</SecondaryButton>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </AnimateWrapper>
  )
}

export default StillBuildingPage
