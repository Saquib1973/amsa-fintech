import React from 'react'
import { cn } from '@/lib/utils'
const PrimaryButton = ({ children, onClick , prefixIcon, suffixIcon ,className }: { children: React.ReactNode, onClick ?: () => void, prefixIcon ?: React.ReactNode, suffixIcon ?: React.ReactNode ,className ?: string }) => {
  return (
    <button
      className={cn(
        'rounded-2xl border-b-4 md:text-lg tracking-wide flex items-center justify-center gap-2 border-blue-800 bg-blue-400 min-w-max px-5 text-white p-3 font-bold uppercase transition-all cursor-pointer w-fit',
        className
      )}
      onClick={onClick}
    >
      {prefixIcon} {children} {suffixIcon}
    </button>
  )
}

export default PrimaryButton