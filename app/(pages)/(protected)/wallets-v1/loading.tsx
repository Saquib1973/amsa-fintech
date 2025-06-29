import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Heading Section Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
              <Skeleton className="h-12 md:h-16 w-48 md:w-64" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-6 md:py-16">
        <div className="space-y-12">
          {/* Connect Wallet Button Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-12 w-[300px] rounded-lg" />
          </div>

          {/* Wallet Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  {/* Wallet Type */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>

                  {/* Address Section */}
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 flex-1" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>

                  {/* Balance Section */}
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
