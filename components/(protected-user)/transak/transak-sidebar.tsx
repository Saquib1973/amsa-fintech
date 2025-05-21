"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, RefreshCw } from 'lucide-react'

const TransakSidebar = () => {
  const pathname = usePathname()

  const tabOptions = [
    {
      label: "Transak",
      href: "/transak",
      icon: Wallet,
    },
    {
      label: "Refresh Token",
      href: "/transak/refresh-token",
      icon: RefreshCw,
    },
  ];

  return (
    <div className="w-full md:w-48">
      <nav
        className="
        sticky top-[230px] md:top-[70px] left-0
          flex
          flex-row md:flex-col
          w-full
          gap-1
          bg-white md:bg-transparent
          max-md:border-b-2 border-gray-200
          md:py-4
          overflow-x-auto md:overflow-visible
        "
      >
        {tabOptions.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              href={tab.href}
              key={tab.label}
              className={`
                flex items-center gap-2
                px-4 py-4 md:py-2
                transition-colors
                whitespace-nowrap
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600'
                }
                ${isActive && 'md:border-r-4 md:border-blue-500'}
              `}
            >
              <Icon
                size={18}
                className={isActive ? 'text-blue-600' : 'text-gray-500'}
              />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default TransakSidebar;
