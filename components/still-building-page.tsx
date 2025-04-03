import React from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import SecondaryButton from './button/secondary-button'

const StillBuildingPage = () => {
  return (
    <AnimateWrapper>
      <SectionWrapper>
        <div className="page-container">
          <div className="mx-auto flex flex-col items-center justify-center gap-6">
            <h1 className="text-6xl font-light">
              We&apos;re still building
              <span className="italic block text-blue-400">
                something amazing
              </span>
            </h1>
            <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
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
