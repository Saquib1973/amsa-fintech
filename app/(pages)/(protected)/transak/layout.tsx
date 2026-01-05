import React from 'react'

const TransakLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex max-md:flex-col w-full">
      {children}
    </div>
  )
}

export default TransakLayout