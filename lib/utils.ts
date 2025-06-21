import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const moveToTop = (y:number = 0) => {
  window.scrollTo({
    top: y,
    left: 0,
    behavior: 'smooth'
  })
}
