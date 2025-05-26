"use client"
import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Loader from '../loader-component'

const PrimaryButton = ({
  disabled,
  children,
  onClick,
  prefixIcon,
  suffixIcon,
  className,
  loading = false,
  link,
  type,
  ...rest
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  className?: string
  link?: string
  type?: 'button' | 'submit'
  loading?: boolean
} & Record<string, unknown>) => {
  if (link) {
    return (
      <Link href={link} className={cn(
        'rounded-full text-base tracking-wide flex items-center justify-center gap-2 bg-primary-main hover:bg-primary-main-hover trnasition-all min-w-max text-white p-3 px-6 transition-all cursor-pointer w-fit',
        className,
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      >
        {
          loading ? (
            <Loader size="sm" noMessage />
          ) : (
            <>
              {prefixIcon} {children} {suffixIcon}
            </>
          )
        }
      </Link>
    )
  }
  return (
    <motion.button
      disabled={disabled || loading}
      type={type}
      className={cn(
        'rounded-full text-base tracking-wide flex items-center justify-center gap-2 bg-primary-main hover:bg-primary-main-hover trnasition-all min-w-max text-white p-3 px-6 transition-all cursor-pointer w-fit',
        className,
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      {...rest}
    >
      {
        loading ? (
          <Loader size="sm" noMessage />
        ) : (
          <>
            {prefixIcon} {children} {suffixIcon}
          </>
        )
      }
    </motion.button>
  )
}

export default PrimaryButton
