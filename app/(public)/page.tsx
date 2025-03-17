import HeroSection from '@/components/home-page/hero-section'
import TrustSection from '@/components/home-page/trust-section'
import AboutUsSection from '@/components/home-page/about-us-section'
import CtaSectionOne from '@/components/home-page/cta-section-one'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

const page = () => {
  return (
    <AnimateWrapper>
      <div className='min-h-screen'>
        <HeroSection />
        <TrustSection />
        <AboutUsSection />
        <CtaSectionOne />
      <div className='flex justify-center items-center bg-blue-400 text-white text-4xl md:text-6xl font-light h-[500px]'>
        Building 🛠️
      </div>
    </div>
    </AnimateWrapper>
  )
}

export default page