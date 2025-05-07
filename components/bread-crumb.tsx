'use client'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const Breadcrumb = ({className}:{className?:string}) => {
  const pathname = usePathname()
  const router = useRouter()
  const breadCrumbs = pathname.split('/').slice(1)
  const length = breadCrumbs.length
  const handleBreadcrumbClick = (index: number) => {
    if (index === length - 1) return
    let path = ''
    for (let i = 0; i <= index; i++) {
      path += `/${breadCrumbs[i]}`
    }
    router.push(path)
  }
  return (
    <div className={cn("flex items-center gap-1 p-1",className)}>
      {breadCrumbs.map((crumb, index) => (
        <React.Fragment key={index+"key"}>
          <button
            onClick={() => handleBreadcrumbClick(index)}
            className={cn(
              index !== length - 1
                ? 'font-light text-gray-500'
                : 'text-primary-main font-base',
              'cursor-pointer'
            )}
          >
            {crumb}
          </button>
          {index !== length - 1 && <ChevronRight className="size-4" />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
