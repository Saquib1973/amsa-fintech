import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import React from 'react'
import Image from 'next/image'
import TrustSection from '@/components/home-page/trust-section'
import BlueHeadingContainer from '@/components/containers/blue-heading-container'
const AboutUsPage = () => {
  const content = [
    {
      title: 'Our Mission',
      description:
        'At AMSA Fintech and IT solutions, our mission is to help businesses grow by providing innovative IT solutions. We strive to deliver the highest quality products and services that exceed our clients&apos; expectations.',
    },
    {
      title: 'About Us',
      description:
        'Welcome to AMSA FINTECH, an AUSTRAC-registered cryptocurrency exchange committed to delivering a secure, transparent, and user-friendly trading experience. At AMSA FINTECH, we prioritize compliance and safety, ensuring all transactions align with Australian regulations to protect our customers and their assets. Our platform offers seamless access to a wide range of digital assets, empowering both beginners and seasoned traders to manage and grow their portfolios with confidence. Join us in navigating the future of finance with integrity and innovation.',
    },
    {
      title: 'Fintech',
      description:
        " With utmost professionalism dedicated to safeguarding your assets and maintaining the integrity of our exchange, we prioritize security and reliability above all else. Our robust security measures, including multi-factor authentication, are designed to protect your funds and personal information from unauthorized access.Beyond our commitment to security, we strive to offer a user-friendly experience. Whether you're a seasoned investor or new to the world of digital currencies, our exchange provides competitive rates to navigate the markets easily. At AMSA, we believe in fostering trust and transparency within the digital currency ecosystem. That's why we are dedicated to communicating with our customers for any pre or post-transaction queries. ",
    },
    {
      title: 'IT Solutions',
      description:
        "Empowering your business through tailored IT solutions. At AMSA, we're dedicated to delivering reliable, innovative, and cost-effective IT services that drive your success. From managed IT support to cloud solutions and beyond, we're here to streamline your operations and elevate your digital infrastructure. Partner with us and unlock the full potential of technology for your business growth.",
    },
  ]
  return (
    <AnimateWrapper>
      <div className="page-container">
        <BlueHeadingContainer>About Us</BlueHeadingContainer>
          <div className="flex max-md:flex-col-reverse items-start gap-10 w-full max-w-[1400px] max-md:px-8 p-16 mx-auto">
          <div className="md:w-1/2 flex gap-4 flex-col space-y-8 justify-end">
            {content.map((item) => (
              <div className="flex flex-col gap-4" key={item.title}>
                <h1 className="text-4xl text-blue-400 mb-2 underline underline-offset-4 font-light">
                  {item.title}
                </h1>
                <p className="text-xl font-light">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="/images/about-us.png"
              className="bg-gray-100 h-[500px] w-[500px] object-cover"
              alt="About Us"
              width={500}
              height={500}
            />
          </div>
        </div>
        <TrustSection />
      </div>
    </AnimateWrapper>
  )
}

export default AboutUsPage
