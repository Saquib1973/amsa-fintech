import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const NotificationLoader = () => {
  return (
    <div className="divide-y divide-gray-200">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-2 min-w-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mt-2" />
        </div>
      ))}
    </div>
  )
}

export default NotificationLoader;
