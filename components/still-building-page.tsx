import React from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import SecondaryButton from './button/secondary-button'

const StillBuildingPage = () => {
  return (
    <AnimateWrapper className="bg-[#4B52DB]">
      <SectionWrapper>
        <div
          style={{
            backgroundImage: 'url(/images/construction.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          className="page-container relative"
        >
          <div className="absolute inset-0 bg-primary-main/90 z-0 h-32 w-full max-w-[650px] left-1/2 -translate-x-1/2 -skew-6" />
          <div className="mx-auto flex flex-col items-center justify-center gap-6">
            <h1 className="text-6xl font-light z-50">
              We&apos;re still building
              <span className="italic block text-white">
                something amazing
              </span>
            </h1>
            <p className="text-lg text-center z-50 text-gray-200 max-w-2xl mx-auto">
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
