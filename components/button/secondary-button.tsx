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
        'rounded-full text-base tracking-wide flex items-center justify-center gap-2 bg-gray-100 p-3 px-6 text-black transition-all cursor-pointer w-full',
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
