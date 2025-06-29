'use client'
import SectionWrapper from '../wrapper/section-wrapper'
import Image from 'next/image'
import React from 'react'
import { motion, easeOut } from 'framer-motion'

const headingContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const headingChar = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
}

const serviceContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
}

const serviceCard = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
}

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
      <div className="relative max-2xl:min-h-screen bg-surface-alt py-12 md:py-20 lg:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-16 md:space-y-24">
            <h1 className='text-3xl md:hidden font-light text-gray-900'>
              What We Can Do For You ?
            </h1>
            <div className='max-md:hidden'>
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight"
                variants={headingContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {
                  'WHAT WE CAN DO FOR YOU ?'.split("").map((char, index) =>
                    char === ' '
                      ? <span key={index} style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
                      : <motion.span key={index} className="inline-block" variants={headingChar}>{char}</motion.span>
                  )
                }
              </motion.h1>
              <motion.div
                className='h-1.5 ml-2 md:ml-4 my-2 rounded-full bg-primary-main'
                initial={{ width: "20%", opacity: 0 }}
                whileInView={{ width: '80%', opacity: 1 }}
                transition={{ duration: 2, delay: 1.2, ease: easeOut }}
                viewport={{ once: true }}
              />
            </div>
            <motion.div
              variants={serviceContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {services.map((service, index) => (
                <React.Fragment key={service.id}>
                  <motion.div
                    variants={serviceCard}
                    className={`flex flex-col md:flex-row gap-6 md:gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="relative w-full h-64 md:h-80 lg:h-96">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <h2 className="text-2xl md:text-3xl text-gray-900 font-medium">{service.title}</h2>
                      <h3 className="text-lg md:text-xl font-light text-gray-700">
                        {service.subtitle}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 font-extralight leading-relaxed">
                        {service.description}
                      </p>
                      <p className="text-sm md:text-base text-gray-600 font-extralight leading-relaxed">
                        {service.additionalInfo}
                      </p>
                    </div>
                  </motion.div>
                  {index < services.length - 1 && (
                    <div className="h-px w-full bg-gray-300 my-8 md:my-12" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default WhatWeCanDoForYouSection
