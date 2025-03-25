import React from 'react'
import PrimaryButton from '../button/primary-button'
import Image from 'next/image'
import SectionWrapper from '../wrapper/section-wrapper'
const CtaSectionTwo = () => {
  return (
    <SectionWrapper className="py-10 md:py-0">
      <div className="flex max-md:flex-col gap-6">
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-3xl md:text-5xl font-light text-gray-900">
            Join 800,000+ Aussies who already trust us with their money Get
            started
          </h1>
          <PrimaryButton>Get Started</PrimaryButton>
        </div>
        <div>
          <Image
            src={'/images/cta-two.png'}
            alt="cta-section-two"
            width={800}
            height={800}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}

export default CtaSectionTwo
