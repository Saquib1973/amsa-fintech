import { cn } from '@/lib/utils'
import React from 'react'
import Link from 'next/link'

const SecondaryButton = ({
  children,
  onClick,
  prefixIcon,
  suffixIcon,
  className,
  type,
  disabled,
  link,
}: {
  children: React.ReactNode
  onClick?: () => void
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  link?: string
}) => {
  const button_css = 'rounded-full text-base w-fit tracking-wide flex items-center justify-center gap-2 bg-surface-main border border-primary-alt-hover dark:bg-primary-main-dark dark:text-white p-3 px-6 text-black transition-all cursor-pointer'
  if(link){
    return (
      <Link href={link} className={cn(
        button_css,
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
        button_css,
        className
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {prefixIcon} {children} {suffixIcon}
    </button>
  )
}

export default SecondaryButton
