import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import React from 'react'
import Image from 'next/image'
import TrustSection from '@/components/home-page/trust-section'
import BlueHeadingContainer from '@/components/containers/blue-heading-container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | AMSA Fintech and IT solutions',
  description: 'Learn more about AMSA Fintech and IT solutions, our mission, and our commitment to providing innovative IT solutions.',
  keywords: 'about us, AMSA Fintech and IT solutions',
}

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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <BlueHeadingContainer>About Us</BlueHeadingContainer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Content Section */}
            <div className="space-y-12">
              {content.map((item) => (
                <div key={item.title} className="group">
                  <h2 className="text-4xl font-light text-blue-600 mb-4">
                    {item.title}
                  </h2>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Image Section */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="/images/about-us.png"
                alt="About Us"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gray-50" />
            </div>
          </div>
        </div>

        <TrustSection />
      </div>
    </AnimateWrapper>
  )
}

export default AboutUsPage
