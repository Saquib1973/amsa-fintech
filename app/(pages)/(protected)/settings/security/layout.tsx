"use client"

import React from 'react'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex max-md:flex-col w-full">
      {children}
    </div>
  )
}