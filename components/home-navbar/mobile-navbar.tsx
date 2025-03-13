'use client'
import { Close, HamburgerMenu } from '@/public/svg'
import SecondaryButton from '@/components/button/secondary-button'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import PrimaryButton from '../button/primary-button'
import RightArrow from './../../public/svg/right-arrow'

interface MenuItem {
  title: string
  href?: string
  target?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Assets',
    children: [
      { title: 'Discover all assets', href: '/au/buy/' },
      { title: 'Bitcoin', href: '/au/buy/bitcoin/' },
      { title: 'Ethereum', href: '/au/buy/ethereum/' },
      { title: 'Solana', href: '/au/buy/solana/' },
      { title: 'USDT', href: '/au/buy/usd-tether/' },
    ],
  },
  {
    title: 'Resources',
    children: [
      { title: 'Learn & Earn', href: '#', target: '_blank' },
      { title: 'Research & analysis', href: '#', target: '_blank' },
    ],
  },
  {
    title: 'About',
    children: [
      { title: 'About us', href: '#', target: '_blank' },
      { title: 'Blog', href: '#', target: '_blank' },
      { title: 'Fees', href: '#', target: '_blank' },
      { title: 'Security', href: '#', target: '_blank' },
    ],
  },
]

const MenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.target}
        className="block py-2 no-underline pl-6 pr-3 text-base leading-7 hover:bg-gray-50"
      >
        {item.title}
      </a>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-sub-menu hover:underline flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base leading-7"
      >
        {item.title}
        <svg
          className={`h-4 w-4 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && item.children && (
        <div className="mt-2 space-y-2">
          {item.children.map((child, index) => (
            <MenuItem key={index + 'mobile-menu-item-child'} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="xl:hidden relative">
      <div className="flex items-center">
        <SecondaryButton
          className="px-4 py-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? (
            <Close className="size-6 cursor-pointer" />
          ) : (
            <HamburgerMenu className="size-6 cursor-pointer" />
          )}
        </SecondaryButton>
      </div>

      {isOpen && (
        <button
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={navRef}
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-gray-200 border-b">
            <h2 className="text-lg md:text-xl font-semibold">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Close className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-4 space-y-4">
              {menuItems.map((item, index) => (
                <MenuItem key={index + 'mobile-menu-item'} item={item} />
              ))}
              <Link
                href="/support"
                className="underline block py-2 text-base leading-7"
              >
                Support
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-col gap-1">
              <Link
                href="/auth/signin"
                className="w-full text-center px-3 py-2.5 text-base flex items-center justify-center gap-2"
              >
                <SecondaryButton>Log in</SecondaryButton>
              </Link>
              <Link
                href="/auth/signup"
                className="w-full text-center px-3 py-2.5 text-base flex items-center justify-center gap-2"
              >
                <PrimaryButton className="w-full">
                  Get started
                  <RightArrow />
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar
