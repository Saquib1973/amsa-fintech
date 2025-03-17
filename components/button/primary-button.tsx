import React from 'react'
import { cn } from '@/lib/utils'
const PrimaryButton = ({ children, onClick , prefixIcon, suffixIcon ,className }: { children: React.ReactNode, onClick ?: () => void, prefixIcon ?: React.ReactNode, suffixIcon ?: React.ReactNode ,className ?: string }) => {
  return (
    <button
      className={cn(
        'rounded-full text-base tracking-wide flex items-center justify-center gap-2 bg-blue-400 min-w-max text-white p-3 px-6 transition-all cursor-pointer w-fit',
        className
      )}
      onClick={onClick}
    >
      {prefixIcon} {children} {suffixIcon}
    </button>
  )
}

export default PrimaryButton