import { cn } from '@/lib/utils'
import React from 'react'

const Loader = ({
  message,
  noMessage = false,
  size = 'md',
  className,
  darker = false,
}: {
  message?: string
  noMessage?: boolean
  size?: 'sm' | 'md' | 'lg'
  darker?: boolean
  className?: string
}) => {
  const sizeClass = {
    sm: 'w-5 h-5 border-[3px]',
    md: 'w-8 h-8 border-[5px]',
    lg: 'w-12 h-12 border-[7px]',
  }

  return (
    <div className={cn("flex flex-col items-center dark:bg-black", className)}>
      <div className='relative'>
        <div
          className={`rounded-full ${sizeClass[size]} border-surface-main dark:border-primary-alt`}
        ></div>
        <div
          className={`absolute top-0 left-0 rounded-full animate-spin ${sizeClass[size]} ${darker ? 'border-blue-800 border-t-transparent' : 'border-blue-500 border-t-transparent'}`}
        ></div>
      </div>
      {!noMessage && (
        <p className="my-2 text-gray-600 font-medium">
          {message || 'Loading...'}
        </p>
      )}
    </div>
  )
}

export default Loader
