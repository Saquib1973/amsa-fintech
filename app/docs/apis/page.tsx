'use client'
import { useState, useEffect } from 'react';
import AnimateWrapper from '@/components/wrapper/animate-wrapper';
import { apiEndpoints } from './data';

export default function APIDocumentationPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AnimateWrapper>
      <div className="md:max-w-[80%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative flex gap-8">
          {/* Navigation Sidebar */}
          <div className="hidden lg:block w-40 flex-shrink-0">
            <div className="fixed top-[88px] w-40 bg-white p-2 rounded-xl max-h-[calc(100vh-88px)] overflow-y-auto">
              <nav className="">
                {apiEndpoints.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block px-3 py-1 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? 'text-blue-600 underline'
                        : 'text-gray-600'
                    }`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-16">
            <div className="mb-12">
              <h1 className="text-5xl font-light text-gray-900 mb-4">API Documentation</h1>
              <p className="text-gray-400">
                Comprehensive documentation for all available API endpoints and their usage.
              </p>
            </div>
            {apiEndpoints.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-2">
                      {section.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    <p className="text-gray-600 mt-2">{section.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-8">
                      {section.endpoints.map((endpoint) => (
                        <div key={`${endpoint.method}-${endpoint.path}`} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-lg font-mono text-gray-800">{endpoint.path}</code>
                          </div>
                          <p className="text-gray-600 mb-4">{endpoint.description}</p>
                          <div className="rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Response</h3>
                            <pre className="text-sm text-gray-600 overflow-x-auto">
                              {JSON.stringify(endpoint.response, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </AnimateWrapper>
  );
}