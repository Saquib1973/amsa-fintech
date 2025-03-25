import React from 'react'

const Loader = ({ message }: { message?: string }) => {
  return (
    <>
      <div className="relative">
        <div className="w-8 h-8 border-4 border-gray-100 rounded-full"></div>
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message || 'Loading...'}</p>
    </>
  )
}

export default Loader