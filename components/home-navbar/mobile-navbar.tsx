'use client'
import { Close, HamburgerMenu } from '@/public/svg'
import SecondaryButton from '@/components/button/secondary-button'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import PrimaryButton from '../button/primary-button'
import RightArrow from './../../public/svg/right-arrow'
import { useSession } from 'next-auth/react'
import UserSvg from '@/public/svg/user-svg'
import { menuItems } from '@/lib/data'

interface MenuItem {
  title: string
  href?: string
  target?: string
  children?: MenuItem[]
}

interface MenuItemProps {
  item: MenuItem
  onLinkClick: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (item.href) {
    return (
      <Link
        href={item.href}
        target={item.target}
        onClick={onLinkClick}
        className="block py-2 no-underline pl-6 pr-3 text-base leading-7 hover:bg-gray-50"
      >
        {item.title}
      </Link>
    )
  }

  return (
    <div className=''>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hover:underline flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base leading-7"
      >
        {item.title}
        <svg
          className={`h-4 w-4 ${
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
            <MenuItem key={index + 'mobile-menu-item-child'} item={child} onLinkClick={onLinkClick} />
          ))}
        </div>
      )}
    </div>
  )
}

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()

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
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? (
            <Close className="size-7 cursor-pointer" />
          ) : (
            <HamburgerMenu className="size-7 cursor-pointer" />
          )}
        </button>
      </div>

      {isOpen && (
        <button
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={navRef}
        className={`fixed top-0 left-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out ${
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
                <MenuItem key={index + 'mobile-menu-item'} item={item} onLinkClick={() => setIsOpen(false)} />
              ))}
              <Link
                href="/support"
                onClick={() => setIsOpen(false)}
                className="underline block py-2 text-base leading-7"
              >
                Support
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-col gap-1">
              {session ? (
                <PrimaryButton
                  link="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className='w-full'
                  prefixIcon={<UserSvg />}
                >
                  Dashboard
                </PrimaryButton>
              ) : (
                <>
                  <SecondaryButton
                    link="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className='w-full'
                  >
                    Log in
                  </SecondaryButton>
                  <PrimaryButton
                    link="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    Get started
                    <RightArrow />
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar
