import React from 'react'

const ContentContainer = ({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col gap-4 bg-white">
      <div className="border-b border-gray-200">
        <h2 className="text-2xl font-light p-4 md:p-6">{heading}</h2>
      </div>
      <div className="p-4 md:p-6">{children}</div>
    </div>
  )
}

export default ContentContainer
