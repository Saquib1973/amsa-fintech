import React from 'react'

const OffWhiteHeadingContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-off-white text-black dark:text-white dark:bg-gray-950">
      <div className="max-w-[1400px] p-10 py-20 mx-auto text-5xl md:text-6xl">
        {children}
      </div>
    </div>
  )
}

export default OffWhiteHeadingContainer