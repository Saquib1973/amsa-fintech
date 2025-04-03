import React from 'react'
import AnimateWrapper from './wrapper/animate-wrapper'
import SecondaryButton from './button/secondary-button'
import StillBuildingPage from './still-building-page'
import SectionWrapper from './wrapper/section-wrapper'
const ErrorPage = ({
  error = null,
  building = null,
}: {
  error?: boolean | null
  building?: boolean | null
}) => {
  if (error || building === null) {
    return (
      <AnimateWrapper>
        <SectionWrapper>
          <div className="page-container">
            <div className="width-1600 py-20 p-10 flex flex-col items-center justify-center gap-6">
              <h1 className="text-4xl font-light text-gray-900">
                Page Not Found
              </h1>
              <p className="text-gray-600 text-lg">
                The page you&apos;re looking for doesn&apos;t exist.
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
  } else if (building) {
    return <StillBuildingPage />
  }
}

export default ErrorPage
