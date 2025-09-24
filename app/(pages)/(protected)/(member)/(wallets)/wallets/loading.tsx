import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="bg-off-white text-black dark:text-white dark:bg-gray-950">
        <div className="max-w-[1400px] p-10 py-20 mx-auto text-4xl md:text-6xl">
          <Skeleton className="h-10 md:h-12 w-40 md:w-72" />
        </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8">
        {/* Connect Wallet button placeholder */}
        <Skeleton className="mb-6 h-10 w-48 rounded-full" />

        {/* Tabs placeholder */}
        <div className="flex justify-start gap-1 mb-6 w-full bg-white">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>

        {/* Wallet list placeholder */}
        <ul className="w-full border border-gray-200 divide-y divide-gray-200 dark:border-gray-800 dark:divide-gray-800">
          {['w1','w2','w3','w4'].map((skeletonId) => (
            <li key={skeletonId}>
              <div className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-5 w-12 rounded" />
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <Skeleton className="h-3 w-16 mb-2 ml-auto" />
                  <Skeleton className="h-6 w-20 ml-auto" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}