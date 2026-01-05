'use client'

import Link from 'next/link'
import { NavLinkProps } from './types'

export const NavLink = ({ item, isActive, onClick, isCollapsed }: NavLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    // If item has submenu and no href, prevent navigation
    if (item.hasSubmenu && (!item.href || item.href === '#')) {
      e.preventDefault()
    }
    onClick?.()
  }

  if (isCollapsed) {
    return (
      <div className="flex justify-center w-full">
        <Link
          href={item.href ?? '#'}
          className={`flex text-lg items-center font-light transition-colors w-full justify-center py-4 ${
            isActive
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
          }`}
          onClick={handleClick}
          title={item.name}
        >
          {item.icon}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href={item.href ?? '#'}
        className={`flex text-lg items-center font-light transition-colors w-full px-8 py-2.5 gap-4 ${
          isActive
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
        }`}
        onClick={handleClick}
        title={item.name}
      >
        <span className="mr-2">{item.icon}</span>
        {item.name}
      </Link>
    </div>
  )
}