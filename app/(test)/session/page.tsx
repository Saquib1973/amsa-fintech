'use client'

import PrimaryButton from '@/components/button/primary-button'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import Link from 'next/link'

export default function SessionDebugger() {
  const { data: session, status } = useSession()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <AnimateWrapper>
      <div className="min-h-screen">
        <OffWhiteHeadingContainer>
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
              <Link
                href="/"
                className="text-6xl font-light hover:text-blue-400 transition-colors"
              >
                Session Debug
              </Link>
              <p className="text-xl flex items-center gap-2 text-gray-500 mt-2 font-light">
                Current Status:
                <span
                  className={`p-1 text-white ${
                    status === 'authenticated'
                      ? 'bg-green-500'
                      : status === 'unauthenticated'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  } rounded-full px-4`}
                >
                  {status}
                </span>
              </p>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="py-6 md:py-16">
          <div className="space-y-8">
            {status === 'authenticated' && (
              <div className="bg-white border border-gray-100 rounded-md p-8">
                <h2 className="text-2xl font-light mb-4 text-gray-900">
                  User Information
                </h2>
                <div className="space-y-4">
                  <div className="text-xl text-gray-700 font-light">
                    <span className="text-gray-500">Name:</span>{' '}
                    {session?.user?.name || 'N/A'}
                  </div>
                  <div className="text-xl text-gray-700 font-light">
                    <span className="text-gray-500">Email:</span>{' '}
                    {session?.user?.email}
                  </div>

                  <div className="mt-8">
                    <PrimaryButton
                      onClick={() => setShowDetails(!showDetails)}
                      className="bg-blue-400 hover:bg-blue-500 text-white transition-colors"
                    >
                      {showDetails ? 'Hide' : 'Show'} Session Details
                    </PrimaryButton>
                  </div>

                  {showDetails && (
                    <div className="mt-6">
                      <h3 className="text-xl font-light mb-4 text-gray-900">
                        Raw Session Data
                      </h3>
                      <pre className="p-6 bg-gray-50 border border-gray-100 rounded-md overflow-auto max-h-[400px] text-sm font-light">
                        {JSON.stringify(session, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {status === 'unauthenticated' && (
              <div className="bg-white border border-gray-100 rounded-md p-8">
                <div className="text-xl text-gray-500 italic font-light">
                  You are not signed in.
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="bg-white border border-gray-100 rounded-md p-8">
                <div className="text-xl text-gray-500 italic font-light">
                  Loading session...
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}
