import { cn } from '@/lib/utils'
import React from 'react'

const SecondaryButton = ({
  children,
  onClick,
  prefixIcon,
  suffixIcon,
  className,
  type,
}: {
  children: React.ReactNode
  onClick?: () => void
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
}) => {
  return (
    <button
      className={cn(
        'rounded-2xl border-b-4 md:text-lg tracking-wide flex items-center justify-center gap-2 border-gray-400 bg-gray-100 p-3 font-bold uppercase text-black transition-all cursor-pointer w-full',
        className
      )}
      onClick={onClick}
      type={type}
    >
      {prefixIcon} {children} {suffixIcon}
    </button>
  )
}

export default SecondaryButton
