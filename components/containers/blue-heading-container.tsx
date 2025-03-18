import { cn } from '@/lib/utils'
import React from 'react'

const BlueHeadingContainer = ({children,className}: {children: React.ReactNode,className?: string}) => {
  return (
    <div className="bg-blue-400">
      <div className={cn("max-w-[1400px] p-2 py-16 text-white mx-auto text-center text-5xl md:text-6xl",className)}>
        {children}
      </div>
    </div>
  )
}

export default BlueHeadingContainer