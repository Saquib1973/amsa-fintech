import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="bg-off-white text-black dark:text-white dark:bg-gray-950">
        <div className="max-w-[1400px] p-10 py-20 mx-auto text-5xl md:text-6xl">
          <Skeleton className="h-12 w-48 md:w-64" />
        </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="mb-10 h-10 w-48 rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-2xl p-6 bg-gray-50 dark:bg-gray-900 shadow-sm flex flex-col min-h-[160px]">
              <Skeleton className="h-4 w-16 mb-4" />
              <Skeleton className="h-5 w-full mb-4" />
              <Skeleton className="h-0.5 w-full my-2" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}