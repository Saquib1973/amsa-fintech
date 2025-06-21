import React from 'react'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'

const DashboardLoading = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <OffWhiteHeadingContainer>
          <div className="py-8">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Amount Card */}
            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                </div>
              </div>
            </div>

            {/* 24h Change Card */}
            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
                </div>
              </div>
            </div>

            {/* Active Assets Card */}
            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-4"></div>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-1"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Popular Assets */}
              <div className="bg-white pt-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 px-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                </div>
                <div className="">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mb-1"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100">
                  <div className="flex w-full items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 px-6 py-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20"></div>
                    <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Settings & Support */}
              <div className="bg-white pt-6 border border-gray-100">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40 mb-4 px-6"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLoading