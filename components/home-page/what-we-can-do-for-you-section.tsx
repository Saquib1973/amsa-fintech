import SectionWrapper from '../wrapper/section-wrapper'
import Image from 'next/image'
import React from 'react'

const WhatWeCanDoForYouSection = () => {
  const services = [
    {
      id: 1,
      title: 'DIGITAL CURRENCY EXCHANGE',
      subtitle: 'AMSA Fintec: Digital Currency Exchange Solutions',
      description:
        'AMSA Fintec offers specialized solutions in the rapidly evolving space of digital currencies, providing businesses and individuals with secure, scalable, and efficient platforms for cryptocurrency trading and exchange.',
      additionalInfo:
        'Our expertise in blockchain technology, digital wallets, and financial systems enables us to deliver comprehensive solutions that meet the growing demand for digital currency transactions.',
      image: '/images/wwcdfy1.webp',
    },
    {
      id: 2,
      title: 'INFORMATION TECHNOLOGY SERVICES',
      subtitle: 'AMSA: Cloud Solutions and Digital Infrastructure',
      description:
        'AMSA is at the forefront of providing comprehensive IT services focused on cloud solutions and digital infrastructure. Our goal is to empower organizations with scalable, secure, and efficient cloud environments.',
      additionalInfo:
        'We offer a wide range of services designed to optimize your IT landscape with cutting-edge cloud technologies and robust digital infrastructure.',
      image: '/images/wwcdfy2.webp',
    },
    {
      id: 3,
      title: 'BUSINESS INTELLIGENCE',
      subtitle: 'Transforming Data into Actionable Business Intelligence',
      description:
        'AMSA FinTech is a specialized IT solutions provider focused on Business Intelligence (BI), Advanced Reporting, and Data-Driven Decision Making.',
      additionalInfo:
        'We empower organizations with cutting-edge Power BI dashboards, Salesforce Data Analytics, and Einstein AI-driven insights to help them unlock the full potential of their data.',
      image: '/images/wwcdfy3.webp',
    },
  ]

  return (
    <SectionWrapper className="max-w-full w-full max-md:px-0">
      <div className="relative max-2xl:min-h-screen bg-surface-alt py-20 md:py-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-24">
            <h1 className="text-5xl text-black">
              WHAT WE CAN DO FOR YOU ?
            </h1>
            {services.map((service, index) => (
              <React.Fragment key={service.id}>
                <div
                  className={`flex flex-col md:flex-row gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="relative w-full">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl text-gray-900">{service.title}</h2>
                    <h3 className="text-xl font-light text-gray-700">
                      {service.subtitle}
                    </h3>
                    <p className="text-gray-600 font-extralight leading-relaxed">
                      {service.description}
                    </p>
                    <p className="text-gray-600 font-extralight leading-relaxed">
                      {service.additionalInfo}
                    </p>
                  </div>
                </div>
                {index < services.length - 1 && (
                  <div className="h-px w-full bg-gray-300 mb-12" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default WhatWeCanDoForYouSection
