import React from 'react'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse">
    <div className="bg-gradient-to-tr aspect-video from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center p-10 rounded">
      <div className="h-8 w-1/2 bg-gray-300 rounded" />
    </div>
    <div className="h-6 w-1/3 bg-gray-200 rounded" />
  </div>
)

const loading = () => {
  return (
    <AnimateWrapper>
      <div className="page-container">
        <OffWhiteHeadingContainer>Blogs</OffWhiteHeadingContainer>
        <div className="width-1600 py-20 p-10 flex flex-col gap-10">
          <h1 className="text-xl font-light">
            <span className="underline underline-offset-4">Home</span>
            {` / Blog`}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default loading