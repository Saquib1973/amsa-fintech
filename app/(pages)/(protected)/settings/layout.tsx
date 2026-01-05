import React from 'react'

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex max-md:flex-col">
      {children}
    </div>
  )
}

export default SettingsLayout