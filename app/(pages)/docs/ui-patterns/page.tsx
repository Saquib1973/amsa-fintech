'use client'
import { useState, useEffect } from 'react';
import AnimateWrapper from '@/components/wrapper/animate-wrapper';
import type { UIComponent } from './types';
import { uiComponents } from './data';

const ComponentSection = ({ component }: { component: UIComponent }) => {
  const [activeTab, setActiveTab] = useState<'example' | 'usage'>('example');

  return (
    <section
      id={component.id}
      className="scroll-mt-24"
    >
      <div className="bg-gray-50 border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <span className="inline-block px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-2">
            {component.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-900">{component.title}</h2>
          <p className="text-gray-600 mt-2">{component.description}</p>
        </div>
        <div className="">
          <div className="border-b border-gray-200">
            <nav className="flex px-2">
              <button
                onClick={() => setActiveTab('example')}
                className={`py-4 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'example'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Example
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`py-4 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'usage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Usage
              </button>
            </nav>
          </div>
          <div className="bg-white p-6">
            {activeTab === 'example' ? (
              <div className="rounded-lg p-6">
                {component.content}
              </div>
            ) : (
              <div className="bg-blue-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-100 whitespace-pre-wrap">
                  {component.usage}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function UIPatternsPage() {
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
          <div className="hidden lg:block w-40 flex-shrink-0">
            <div className="fixed top-[88px] w-40 bg-white p-2 rounded-xl max-h-[calc(100vh-88px)] overflow-y-auto">
              <nav className="">
                {(uiComponents as unknown as UIComponent[]).map((component) => (
                  <a
                    key={component.id}
                    href={`#${component.id}`}
                    className={`block px-3 py-1 rounded-md text-sm transition-colors ${
                      activeSection === component.id
                        ? 'text-blue-600 underline'
                        : 'text-gray-600'
                    }`}
                  >
                    {component.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 space-y-16">
            <div className="mb-12">
              <h1 className="text-5xl font-light text-gray-900 mb-4">UI Patterns</h1>
              <p className="text-gray-400">
                A collection of reusable UI components and patterns for building consistent interfaces.
              </p>
            </div>
            {(uiComponents as unknown as UIComponent[]).map((component) => (
              <ComponentSection key={component.id} component={component} />
            ))}
          </div>
        </div>
      </div>
    </AnimateWrapper>
  );
}