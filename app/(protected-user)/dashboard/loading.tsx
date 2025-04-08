import Loader from '@/components/loader-component'
import React from 'react'

export default function Loading() {
  return (
    <div className="flex bg-white dark:bg-black flex-col gap-2 justify-center items-center h-screen">
      <Loader message="Loading user data..." />
    </div>
  )
}
