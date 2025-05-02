import AboutUsSection from '@/components/home-page/about-us-section'
import CtaSectionOne from '@/components/home-page/cta-section-one'
import CtaSectionTwo from '@/components/home-page/cta-section-two'
import HeroSection from '@/components/home-page/hero-section'
import TrustSection from '@/components/home-page/trust-section'
import UtilityPricePlay from '@/components/home-page/utility-price-play'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import SecondaryButton from './../../components/button/secondary-button'
const page = () => {
  return (
    <AnimateWrapper>
      <div className="min-h-screen">
        <HeroSection />
        <TrustSection />
        <AboutUsSection />
        <CtaSectionOne />
        <UtilityPricePlay />
        {/* Temporary */}
        <SectionWrapper>
          <h1 className="text-center text-6xl font-light">
            The help you need,
            <span className="italic block text-primary-main">
              {' '}
              when you need it
            </span>
          </h1>
          <div className="flex justify-center mt-8">
              <SecondaryButton link="/assets">Explore Assets</SecondaryButton>
          </div>
        </SectionWrapper>
        <CtaSectionTwo />
      </div>
    </AnimateWrapper>
  )
}

export default page
