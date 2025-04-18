import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function moveToTop(where: 'top' | number = 'top') {
  if (where !== 'top') {
    window.scrollTo({
      top: where,
      behavior: 'smooth',
    })
    return
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
