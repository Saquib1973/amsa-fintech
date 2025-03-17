import React from 'react'

const ContainerOne = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-blue-400">
      <div className="max-w-[1400px] p-16 text-white mx-auto text-center text-5xl md:text-6xl">
        {children}
      </div>
    </div>
  )
}

export default ContainerOne