import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import React from 'react'

const page = () => {
  return (
    <AnimateWrapper>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">All Assets</h1>
      </div>
    </AnimateWrapper>
  )
}

export default page