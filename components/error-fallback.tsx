'use client'
import Link from 'next/link'
import React from 'react'
import StillBuildingPage from './still-building-page'
import { ArrowDownRight } from 'lucide-react'
import AnimateWrapper from './wrapper/animate-wrapper'
import SectionWrapper from './wrapper/section-wrapper'
import SecondaryButton from './button/secondary-button'

const navOptions = [
  {
    label: 'Home',
    description: 'Back to the main page',
    href: '/',
  },
  {
    label: 'Support',
    description: 'Get help or contact us',
    href: '/support',
  },
  {
    label: 'Assets',
    description: 'Browse our resources and assets',
    href: '/assets',
  },
]

const ErrorPage = ({
  error = null,
  building = null,
  simple = false,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist.",
}: {
  error?: boolean | null
  building?: boolean | null
  simple?: boolean
  title?: string
  message?: string
}) => {
  if (error || building === null) {
    if (simple) {
      return (
        <AnimateWrapper>
          <SectionWrapper>
            <div className="page-container">
              <div className="width-1600 py-20 p-10 flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-light text-gray-900">
                  {title}
                </h1>
                <p className="text-gray-600 text-lg">
                  {message}
                </p>
                <SecondaryButton
                  link="/"
                  className=""
                >
                  Return to Home
                </SecondaryButton>
              </div>
            </div>
          </SectionWrapper>
        </AnimateWrapper>
      )
    }

    return (
      <AnimateWrapper>
        <div className="relative min-h-[90vh] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <span className="text-[20vw] max-lg:hidden md:text-[30vw] font-extrabold text-black tracking-widest z-0">
              4
            </span>
            <div className="relative z-10 bg-black translate-y-4 md:translate-y-9 text-white rounded-3xl border border-gray-200 p-4 md:p-8 w-[90%] max-w-md flex flex-col items-center">
              <h1 className="text-3xl md:text-5xl font-bold text-center mb-2">
                ... 404 error ...
              </h1>
              <p className="text-xl md:text-3xl tracking-wide text-center mb-4">
                Sorry, page not found
              </p>
              <p className="text-center text-gray-400 mb-6 text-sm md:text-base">
                Go to other sections to learn more about Solar Digital
              </p>
              <div className="w-full flex flex-col gap-2 md:gap-3">
                {navOptions.map((opt, idx) => (
                  <Link
                    key={opt.label}
                    href={opt.href}
                    className={`flex cursor-pointer items-center justify-between p-3 md:p-4 rounded-lg border transition group ${
                      idx === 0
                        ? 'text-blue-100 bg-primary-main border-blue-900'
                        : 'text-gray-800 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm md:text-base">{opt.label}</div>
                      <div className="text-xs">{opt.description}</div>
                    </div>
                    <span className="ml-2 font-bold text-base md:text-lg group-hover:-rotate-90 duration-500 -rotate-45 group-hover:bg-gray-100 rounded-full aspect-square h-5 md:h-6 w-5 md:w-6 flex justify-center items-center group-hover:text-black transition-all">
                      <ArrowDownRight className="w-3 md:w-4 h-3 md:h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <span className="text-[20vw] max-lg:hidden md:text-[30vw] font-extrabold text-black tracking-widest z-0">
              4
            </span>
          </div>
        </div>
      </AnimateWrapper>
    )
  } else if (building) {
    return <StillBuildingPage />
  }
}

export default ErrorPage
