"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  faqData: FAQItem[]
}

const FAQComponent: React.FC<FAQProps> = ({ faqData }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="p-8 py-16">
      <h2 className="text-4xl mb-6 font-bold text-gray-800">Frequently Asked Questions</h2>
      <div className="">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="flex w-full justify-between items-center p-5 text-left bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
              <motion.svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
                animate={{ rotate: openFaq === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M18.605 7l-6.793 7.024-6.375-7.002L4 8.467 11.768 17l.485-.501L20 8.489z"
                />
              </motion.svg>
            </button>
            <AnimatePresence>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="p-5 pt-0 text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FAQComponent