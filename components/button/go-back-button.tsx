"use client"
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SecondaryButton from './secondary-button'
const GoBackButton = ({ className, redirect }: { className?: string, redirect?: string }) => {
  const router = useRouter()
  return (
    <SecondaryButton className={cn("p-2 aspect-square hover:bg-gray-200 transition-all", className)} onClick={() => {
      if (redirect) {
        router.push(redirect)
      } else {
        router.back()
      }
    }}>
      <ArrowLeft className='size-6 xl:size-6' />
    </SecondaryButton>
  )
}

export default GoBackButton