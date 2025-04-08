import React from 'react'

const Loader = ({
  message,
  noMessage = false,
  size = 'medium',
  darker = false,
}: {
  message?: string
  noMessage?: boolean
  size?: 'small' | 'medium' | 'large'
  darker?: boolean
}) => {
  const sizeClass = {
    small: 'w-5 h-5 border-[3px]',
    medium: 'w-8 h-8 border-[5px]',
    large: 'w-12 h-12 border-[7px]',
  }

  return (
    <div className="flex flex-col items-center bg-white dark:bg-black">
      <div className="relative">
        <div
          className={`rounded-full ${sizeClass[size]} border-gray-200 dark:border-gray-800`}
        ></div>
        <div
          className={`absolute top-0 left-0 rounded-full animate-spin ${sizeClass[size]} ${darker ? 'border-blue-800 border-t-transparent' : 'border-blue-500 border-t-transparent'}`}
        ></div>
      </div>
      {!noMessage && (
        <p className="mt-2 text-gray-600 font-medium">
          {message || 'Loading...'}
        </p>
      )}
    </div>
  )
}

export default Loader
