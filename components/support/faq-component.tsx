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
    <div className="p-6 py-16 border-y border-gray-200">
      <div className="width-1600 grid grid-cols-1 lg:grid-cols-3">
        <h2 className="text-6xl flex flex-col gap-2 font-light mb-6 text-gray-800">
          Frequently <br />
          asked questions
          <span className="text-lg ml-1 mt-2">Still have more questions?</span>
        </h2>
        <div className="col-span-2 flex flex-col gap-2">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="overflow-hidden bg-off-white"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full bg-off-white justify-between items-center p-6 text-left "
              >
                <h3 className="text-xl font-light text-gray-800">
                  {faq.question}
                </h3>
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
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="p-6 pt-0 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQComponent