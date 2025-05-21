import React from 'react'
import TransakSidebar from '@/components/(protected-user)/transak/transak-sidebar'
const TransakLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex max-md:flex-col'>
      <TransakSidebar />
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default TransakLayout