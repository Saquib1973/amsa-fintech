'use client'
import Link from 'next/link';
import AnimateWrapper from '@/components/wrapper/animate-wrapper';

const docSections = [
  {
    title: 'UI Patterns',
    description: 'Collection of reusable UI components and patterns for building consistent interfaces.',
    href: '/docs/ui-patterns',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    title: 'APIs',
    description: 'Comprehensive API documentation and examples for integrating with our platform.',
    href: '/docs/apis',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
];

const useCases = [
  'Crypto Exchanges (CEX, DEX), Trading Apps',
  'Wallets (Hot, Cold)',
  'Data Aggregator, Crypto Screener, Analytics Dashboard',
  'Block Explorer, Portfolio Tracker',
  'DeFi Protocols, NFT Marketplaces, Digital Bank',
  'Backtesting Trading Strategy',
  'Accounting, Tax, Audit, HR Payroll',
  'Research & Analysis: Media, Institution, Academic, VC, Financial',
  'Oracles, Bots, Payments, E-commerce',
]

export default function Documentation() {
  return (
    <AnimateWrapper>
      <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-light mb-6">Introduction</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-8 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚠️</span>
            <span className="font-semibold text-yellow-800">Important Note</span>
          </div>
          <div className="text-yellow-900 text-sm">
            This documentation is exclusively for Public API users (Demo plan).<br />
            <span className="font-bold">This is a test documentation for the AMSA Fintech app.</span><br />
            To access the Pro API Documentation (for paid plan subscribers), please contact support.
          </div>
        </div>
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">What is AMSA Fintech?</h2>
          <p className="text-blue-900 mb-2">
            <span className="font-semibold">AMSA Fintech</span> is a modern, modular platform for building, integrating, and scaling financial technology solutions. It provides a suite of APIs, reusable UI patterns, and developer tools to help you create robust, secure, and scalable fintech applications with ease.
          </p>
          <p className="text-blue-900">
            <span className="font-semibold">Note:</span> This documentation is for demonstration and testing purposes only. The features, endpoints, and UI patterns described here may not reflect the final production system.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Common Use Cases</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            {useCases.map((uc) => (
              <li key={uc}>{uc}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {docSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group block p-6 bg-white border border-gray-200 rounded-xl transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-4">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </AnimateWrapper>
  );
}
