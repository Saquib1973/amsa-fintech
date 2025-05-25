import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function moveToTop(top: number = 0) {
  window.scrollTo({
    top: top,
    behavior: 'smooth'
  });
}