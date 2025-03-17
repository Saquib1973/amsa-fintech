import PrimaryButton from '@/components/button/primary-button'
import Link from 'next/link'
import React from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

const NotFoundPage = () => {
  return (
    <AnimateWrapper>
      <div className="min-h-screen flex items-center justify-center flex-col gap-8">
        <p className="text-4xl mb-5">
          <span className='text-blue-400'>404</span> Error
        </p>
        <h1 className="text-7xl tracking-wide">Nothing here!</h1>
        <Link href="/">
          <PrimaryButton className="mt-2">Back to home page</PrimaryButton>
        </Link>
      </div>
    </AnimateWrapper>
  )
}

export default NotFoundPage