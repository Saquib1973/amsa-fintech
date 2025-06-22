import React from 'react'
import {
  Info,
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  Shield,
  Wallet,
} from '@/public/svg'
import FAQComponent from '@/components/support/faq-component'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import BlueHeadingContainer from '@/components/containers/blue-heading-container'
import PrimaryButton from '@/components/button/primary-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support | AMSA Fintech and IT solutions',
  description: 'Support for AMSA Fintech and IT solutions',
  keywords: 'support, AMSA Fintech and IT solutions',
}

const faqData = [
  {
    question: 'What is a digital currency exchange?',
    answer:
      'A digital currency exchange is an online entity that facilitates the exchange of Fiat currencies into digital and vice versa such as Aud to Bitcoin, Ethereum, and others and vice versa.',
  },
  {
    question: 'Is your digital currency exchange secure?',
    answer:
      'Yes, we take security very seriously. Our digital currency exchange deploys advanced encryption techniques and multi-factor authentication to protect your data from unauthorized access.',
  },
  {
    question: 'Can I use your services on mobile devices?',
    answer:
      'Yes, our services are optimized for mobile devices, allowing you to trade digital currencies conveniently from your smartphone or tablet using mobile-responsive website.',
  },
  {
    question: 'Are there any fees associated with trading on your exchange?',
    answer:
      'No, we do not charge any fee for conversion of currencies other than the conversion rate itself.',
  },
  {
    question: 'What payment methods do you accept for conversion?',
    answer:
      'We accept OSKO bank transfers from all Australian banks and the transfer of digital assets to your digital wallets and we follow escrow mechanism for all the transactions.',
  },
  {
    question: 'What digital currencies can I get from your exchange?',
    answer:
      'We offer a variety of digital currencies for trading, including USDT (Tether) Bitcoin (BTC), Polygon (MATIC), Solana (SOL), and many others.',
  },
  {
    question: 'How long does it take to process deposits and withdrawals?',
    answer:
      'The processing time for deposits and withdrawals varies depending on the payment method and network congestion. Osko Bank transfers are typically instant however in some cases could take up to 24 hours, while digital currency transfers are usually instant.',
  },
  {
    question: 'Is customer support available if I encounter any issues?',
    answer:
      "Yes, we provide customer support to assist you with any questions or issues you may encounter. You can reach out to our support team via email, what's App chat and telegram during business hours.",
  },
  {
    question: 'How do I get started with your digital currency exchange?',
    answer:
      'To get started, simply contact us through our WhatsApp number, Telegram, and Binance. Once your identification is verified, we can start exchanging digital currencies.',
  },
  {
    question: 'Do I need to verify my identity to utilize AMSA services?',
    answer:
      'Yes, we adhere to regulatory requirements and require identity verification for your first transaction to comply with anti-money laundering (AML)/ Counter Terrorism Finance (CTF) regulations.',
  },
]

const SupportPage = () => {
  return (
    <AnimateWrapper>
      <div className="w-full min-h-screen">
        <BlueHeadingContainer className="relative">
          <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-light">How can we help?</h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Find answers to your questions or get in touch with our support team
            </p>
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search for help..."
                className="input-field text-black placeholder:text-gray-500 w-full pl-12 pr-4 py-4 rounded-xl transition-all"
              />
              <HelpCircle className="absolute left-4 top-1/2 mt-2 -translate-y-1/2 text-gray-400 size-5" />
            </div>
          </div>
        </BlueHeadingContainer>
        <div className="w-full">
          <HeaderSection />
          <FAQComponent faqData={faqData} />
          <ContactSection />
        </div>
      </div>
    </AnimateWrapper>
  )
}

const HeaderSection = () => {
  return (
    <div className="width-1600 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 py-16">
      {[
        {
          icon: Info,
          title: "Learn Crypto Trading",
          description: "Master the basics of cryptocurrency trading with our comprehensive guides.",
          link: "/guides"
        },
        {
          icon: Wallet,
          title: "Account & Wallet",
          description: "Manage your account settings and wallet preferences.",
          link: "/account"
        },
        {
          icon: Shield,
          title: "Security",
          description: "Learn about our security measures and how to protect your account.",
          link: "/security"
        },
        {
          icon: HelpCircle,
          title: "FAQs",
          description: "Find answers to commonly asked questions.",
          link: "#faqs"
        },
        {
          icon: MessageSquare,
          title: "Live Chat",
          description: "Chat with our support team in real-time.",
          link: "#chat"
        }
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white transition-all duration-300 flex items-center gap-4 justify-start flex-col rounded-xl p-6 py-12 border border-gray-200"
        >
          <item.icon className="text-blue-500 size-12" />
          <h2 className="text-2xl font-light text-center">{item.title}</h2>
          <p className="text-gray-500 text-center">{item.description}</p>
          <PrimaryButton className="mt-4" link={item.link}>
            Learn More
          </PrimaryButton>
        </div>
      ))}
    </div>
  )
}

const ContactSection = () => {
  return (
    <div className="p-6 py-20 flex items-center justify-center flex-col width-1600 bg-gray-50">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl mb-12 font-light text-gray-800 text-center">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Phone,
              title: "Phone Support",
              description: "+1 (555) 123-4567",
              action: "Call Now"
            },
            {
              icon: Mail,
              title: "Email Support",
              description: "support@Amsafintech.com",
              action: "Send Email"
            },
            {
              icon: MessageSquare,
              title: "Live Chat",
              description: "Available 24/7",
              action: "Start Chat"
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <item.icon className="text-blue-500 size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              </div>
              <PrimaryButton className="w-full mt-4">
                {item.action}
              </PrimaryButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupportPage
