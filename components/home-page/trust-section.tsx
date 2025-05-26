'use client'
import React from 'react'
import { motion } from 'framer-motion'
const TrustSection = () => {
  const trustItems = [
    {
      title: 'AUSTRAC',
      description: 'Registered crypto exchange',
    },
    {
      title: 'Australian',
      description: 'Owned and operated',
    },
    {
      title: '440+',
      description: 'Assets for trading',
    },
    {
      title: '4.5/5',
      description: 'Rating on TrustPilot',
    },
  ]
  const length = trustItems.length;
  return (
    <div className="w-full h-full relative py-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item,index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index%(length) * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
              key={item.title}
            >
              <h3 className="text-3xl sm:text-5xl leading-tighter font-extralight">
                {item.title}
              </h3>
              <p className="text-base sm:text-lg text-primary-main font-extralight">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustSection
