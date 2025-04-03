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

export default function Documentation() {
  return (
    <AnimateWrapper>
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
        <p className="text-lg text-gray-600">
          Explore our comprehensive documentation to help you build and integrate with our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {docSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group block p-6 bg-white border border-gray-200 transition-colors"
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
