import React from 'react'

const OffWhiteHeadingSkeleton = () => (
  <div className="bg-off-white text-black dark:text-white dark:bg-gray-950">
    <div className="max-w-[1400px] p-10 py-20 mx-auto">
      <div className="h-12 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
    </div>
  </div>
)

const WalletInfoSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col border-b border-gray-200 animate-pulse">
    <div className="flex items-center max-md:flex-col max-md:items-start justify-between gap-2 text-3xl font-light">
      <div className="flex items-end justify-start gap-2 ">
        <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
      </div>
      <div className="flex items-end justify-center gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
      </div>
    </div>
    <div className="flex items-center justify-start my-4 gap-2 text-3xl font-light">
      <div className="h-4 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-64 bg-gray-200 rounded" />
    </div>
    <div className="flex md:justify-end items-center gap-2">
      <div className="h-4 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-32 bg-gray-200 rounded" />
    </div>
  </div>
)

const TransactionItemSkeleton = () => (
  <div className="flex items-center justify-between w-full border-b border-gray-100 px-2 py-3 group rounded-md animate-pulse">
    <div className="flex items-center gap-2 min-w-[40px]">
      <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-100" />
    </div>
    <div className="flex-1 min-w-0 px-2">
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="ml-2 h-3 bg-gray-100 rounded w-10" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-16 mt-0.5" />
    </div>
    <div className="flex flex-col items-end gap-1 min-w-[90px]">
      <div className="h-4 bg-gray-100 rounded w-14" />
      <div className="flex items-center gap-2 mt-0.5">
        <div className="h-2 w-2 rounded-full bg-gray-100" />
        <div className="h-3 bg-gray-100 rounded w-10" />
      </div>
    </div>
    <div className="flex items-center ml-2">
      <div className="w-4 h-4 bg-gray-100 rounded" />
    </div>
  </div>
)

const QuickLinksSkeleton = () => (
  <div className="md:w-1/3 p-2 animate-pulse">
    <div className="flex flex-col rounded-md">
      <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-8 w-24 bg-gray-100 rounded mb-2" />
      ))}
    </div>
  </div>
)

const loading = () => {
  return (
    <div>
      <OffWhiteHeadingSkeleton />
      <WalletInfoSkeleton />
      <div className="max-w-6xl flex max-md:flex-col mx-auto my-10 px-2">
        <div className="flex flex-col md:w-2/3">
          <div className="h-8 w-64 bg-gray-200 rounded my-4 animate-pulse" />
          {[...Array(8)].map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))}
        </div>
        <QuickLinksSkeleton />
      </div>
    </div>
  )
}

export default loading