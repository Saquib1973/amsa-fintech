import React from 'react'

export default function LoginHistoryLoader() {
  return (
    <div className="">
        <div className="px-3 py-2">
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((index) => (
              <div key={index} className="py-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-1.5 animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
