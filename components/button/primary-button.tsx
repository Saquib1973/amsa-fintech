import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
const PrimaryButton = ({
  disabled,
  children,
  onClick,
  prefixIcon,
  suffixIcon,
  className,
  link,
  type
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  className?: string
  link?: string
  type?: 'button' | 'submit'
}) => {
  if (link) {
    return (
      <Link href={link} className={cn(
        'rounded-full text-base tracking-wide flex items-center justify-center gap-2 bg-primary-main hover:bg-primary-main-hover trnasition-all min-w-max text-white p-3 px-6 transition-all cursor-pointer w-fit',
        className,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {prefixIcon} {children} {suffixIcon}
    </Link>
    )
  }
  return (
    <button
      disabled={disabled}
      type={type}
      className={cn(
        'rounded-full text-base tracking-wide flex items-center justify-center gap-2 bg-primary-main hover:bg-primary-main-hover trnasition-all min-w-max text-white p-3 px-6 transition-all cursor-pointer w-fit',
        className,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
    >
      {prefixIcon} {children} {suffixIcon}
    </button>
  )
}

export default PrimaryButton
