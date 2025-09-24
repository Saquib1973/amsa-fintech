import type { TransactionStatus } from '@/types/transaction-types'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}T`
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}B`
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}M`
  }
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const moveToTop = (y:number = 0) => {
  window.scrollTo({
    top: y,
    left: 0,
    behavior: 'smooth'
  })
}

export const roleRefactor = (role: string) => {
  if (role === 'super_admin') return 'SUPER_ADMIN'
  if (role === 'admin') return 'ADMIN'
  return 'USER'
}

export const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500'
    case 'PENDING':
      return 'bg-yellow-500'
    case 'PROCESSING':
      return 'bg-blue-500'
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}


export const trimWalletAddress = (value: string, keepStart: number = 8, keepEnd: number = 8): string => {
  if (!value) return ''
  const stringValue = String(value)
  const minimumLengthForTrimming = keepStart + keepEnd + 3
  if (stringValue.length <= minimumLengthForTrimming) return stringValue
  return `${stringValue.slice(0, keepStart)}…${stringValue.slice(-keepEnd)}`
}
