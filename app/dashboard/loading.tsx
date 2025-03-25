import Loader from '@/components/loader-component'
import React from 'react'

const loading = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <Loader message="Loading..." />
    </div>
  )
}

export default loading