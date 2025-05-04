"use client"
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SecondaryButton from './secondary-button'
import PrimaryButton from './primary-button'
const GoBackButton = ({ className, redirect, type = 'primary' , size = 'md' }: { className?: string, redirect?: string, type?: 'primary' | 'secondary' , size?: 'sm' | 'md' |'lg' }) => {
  const router = useRouter()
  const sizeMap = {
    sm: 'size-3 xl:size-5',
    md: 'size-4 xl:size-6',
    lg: 'size-5 xl:size-7'
  }
  switch (type) {
    case 'primary':

      return (
        <SecondaryButton className={cn("p-2 aspect-square hover:bg-surface-hover transition-all", className)} onClick={() => {
          if (redirect) {
            router.push(redirect)
          } else {
            router.back()
          }
        }}>
          <ArrowLeft className={sizeMap[size]} />
        </SecondaryButton>
      );
    case 'secondary':
      return (
        <PrimaryButton className={cn("p-2 w-[60px] rounded-2xl", className)} onClick={() => {
          if (redirect) {
            router.push(redirect)
          } else {
            router.back()
          }
        }}>
          <ArrowLeft className={sizeMap[size]} />
        </PrimaryButton>
      );
    default:
      return null;
  }
}

export default GoBackButton