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

    <div className="w-full">
      <div className="page-header px-4 bg-blue-400 text-white">
        <div className="max-w-[1600px] flex-col mx-auto flex gap-4 justify-center">
          <h1 className="text-5xl">How can we help?</h1>
          <input
            type="text"
            placeholder="Search..."
            className="input-field text-black placeholder:text-gray-500 md:min-w-3xl max-md:max-w-3xl"
          />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 py-10">
          <div className="bg-white flex items-center gap-2 border transition-all border-gray-100 justify-center flex-col rounded-lg p-4 py-12 hover:shadow-lg hover:border-blue-200">
            <Info className="text-blue-500 size-10" />
            <h2 className="text-3xl">Learn Crypto Trading</h2>
            <p className="text-gray-500">
              Master the basics of cryptocurrency trading with our comprehensive
              guides.
            </p>
          </div>
          <div className="bg-white flex items-center gap-2 border transition-all border-gray-100 justify-center flex-col rounded-lg p-4 py-12 hover:shadow-lg hover:border-blue-200">
            <Wallet className="text-blue-500 size-10" />
            <h2 className="text-3xl">Account & Wallet</h2>
            <p className="text-gray-500">
              Manage your account settings and wallet preferences.
            </p>
          </div>
          <div className="bg-white flex items-center gap-2 border transition-all border-gray-100 justify-center flex-col rounded-lg p-4 py-12 hover:shadow-lg hover:border-blue-200">
            <Shield className="text-blue-500 size-10" />
            <h2 className="text-3xl">Security</h2>
            <p className="text-gray-500">
              Learn about our security measures and how to protect your account.
            </p>
          </div>
          <div className="bg-white flex items-center gap-2 border transition-all border-gray-100 justify-center flex-col rounded-lg p-4 py-12 hover:shadow-lg hover:border-blue-200">
            <HelpCircle className="text-blue-500 size-10" />
            <h2 className="text-3xl">FAQs</h2>
            <p className="text-gray-500">
              Find answers to commonly asked questions.
            </p>
          </div>
          <div className="bg-white flex items-center gap-2 border transition-all border-gray-100 justify-center flex-col rounded-lg p-4 py-12 hover:shadow-lg hover:border-blue-200">
            <MessageSquare className="text-blue-500 size-10" />
            <h2 className="text-3xl">Live Chat</h2>
            <p className="text-gray-500">
              Chat with our support team in real-time.
            </p>
          </div>
        </div>

        <FAQComponent faqData={faqData} />

        <div className="p-8 m-4">
          <h2 className="text-4xl mb-6 font-bold text-gray-800">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="text-blue-500 size-6" />
              <div>
                <h3 className="font-semibold text-gray-800">Phone Support</h3>
                <p className="text-gray-500">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="text-blue-500 size-6" />
              <div>
                <h3 className="font-semibold text-gray-800">Email Support</h3>
                <p className="text-gray-500">support@Amsafintech.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="text-blue-500 size-6" />
              <div>
                <h3 className="font-semibold text-gray-800">Live Chat</h3>
                <p className="text-gray-500">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AnimateWrapper>
  )
}

export default SupportPage
