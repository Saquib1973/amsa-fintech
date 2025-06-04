import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function moveToTop(y: number) {
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  })
}
