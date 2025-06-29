import AboutUsSection from '@/components/home-page/about-us-section'
import CtaSectionOne from '@/components/home-page/cta-section-one'
import CtaSectionThree from '@/components/home-page/cta-section-three'
import CtaSectionTwo from '@/components/home-page/cta-section-two'
import HeroSection from '@/components/home-page/hero-section'
import Testimonials from '@/components/home-page/testimonials'
import TrustSection from '@/components/home-page/trust-section'
import UtilityPricePlay from '@/components/home-page/utility-price-play'
import WhatWeCanDoForYouSection from '@/components/home-page/what-we-can-do-for-you-section'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import LocationSection from '@/components/home-page/location-section'

const page = () => {
  return (
    <AnimateWrapper>
      <div className="min-h-screen">
        <HeroSection />
        <TrustSection />
        <AboutUsSection />
        <CtaSectionOne />
        <UtilityPricePlay />
        <WhatWeCanDoForYouSection />
        <CtaSectionThree />
        <Testimonials />
        <CtaSectionTwo />
        <LocationSection />
      </div>
    </AnimateWrapper>
  )
}

export default page
