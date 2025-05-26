"use client"

import React from 'react'
import SettingsSidebar from '@/components/(protected-user)/settings/settings-sidebar'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col w-full md:flex-row">
      <SettingsSidebar />
      <main className="flex-1 w-full min-h-[calc(100vh-130px)] md:min-h-[calc(100vh-70px)] p-2">
        {children}
      </main>
    </div>
  )
}