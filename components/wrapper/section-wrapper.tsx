import { cn } from '@/lib/utils'
import React from 'react'

const SectionWrapper = ({ children,className }: { children: React.ReactNode,className?: string }) => {
  return (
    <div
      className={cn(
        'flex py-10 md:py-20 max-md:px-4 border-y border-gray-200 dark:border-gray-800 gap-6',
        className
      )}
    >
      <div className={cn("width-1240 w-full", className)}>{children}</div>
    </div>
  )
}

export default SectionWrapper