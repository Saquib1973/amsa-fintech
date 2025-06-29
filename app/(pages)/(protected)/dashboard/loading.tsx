import React from 'react'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

const DashboardLoading = () => {
  return (
    <AnimateWrapper>
    <div className="bg-gray-50/50 min-h-screen font-sans">
      <OffWhiteHeadingContainer>
        <div>
          <div className="h-12 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
      </OffWhiteHeadingContainer>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-28"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-md border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 border border-gray-100 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded animate-pulse w-32"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md border border-gray-100">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-3">
                      <div className="flex items-center gap-2 min-w-[40px]">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0 px-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                          <div className="h-2 bg-gray-200 rounded animate-pulse w-10"></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded animate-pulse w-16 mt-1"></div>
                      </div>
                      <div className="flex flex-col items-end gap-1 min-w-[90px]">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-14"></div>
                        <div className="h-2 bg-gray-200 rounded animate-pulse w-10"></div>
                      </div>
                      <div className="flex items-center ml-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-md border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded animate-pulse w-8"></div>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex w-full items-center justify-center gap-2 bg-gray-200 px-4 py-2 rounded-md">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                    <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AnimateWrapper>
  )
}

export default DashboardLoading