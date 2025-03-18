import React from 'react'

const OffWhiteHeadingContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-off-white">
      <div className="max-w-[1400px] bg-off-white p-10 py-20 mx-auto text-center text-5xl md:text-6xl">
        {children}
      </div>
    </div>
  )
}

export default OffWhiteHeadingContainer