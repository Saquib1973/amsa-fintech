import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
const PrimaryButton = ({
  children,
  onClick,
  prefixIcon,
  suffixIcon,
  className,
  link,
}: {
  children: React.ReactNode
  onClick?: () => void
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  className?: string
  link?: string
  }) => {
  if(link){
    return (
      <Link href={link} className={cn(
        'rounded-full text-base tracking-wide flex items-center justify-center gap-2 bg-blue-400 min-w-max text-white p-3 px-6 transition-all cursor-pointer w-fit',
        className
      )}
    >
      {prefixIcon} {children} {suffixIcon}
    </Link>
    )
  }
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
