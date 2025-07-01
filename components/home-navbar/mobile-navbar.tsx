'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Close, HamburgerMenu } from '@/public/svg'
import SecondaryButton from '@/components/button/secondary-button'
import React, { useRef } from 'react'
import Link from 'next/link'
import PrimaryButton from '../button/primary-button'
import RightArrow from './../../public/svg/right-arrow'
import { useSession } from 'next-auth/react'
import UserSvg from '@/public/svg/user-svg'
import { menuItems } from '@/lib/data'
import AnimateWrapper from '../wrapper/animate-wrapper'

interface MenuItem {
  title: string
  href?: string
  target?: string
  children?: MenuItem[]
}

interface MenuItemProps {
  item: MenuItem
  onLinkClick: () => void
  isActive: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onLinkClick, isActive }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (item.href) {
    return (
      <Link
        href={item.href}
        target={item.target}
        onClick={onLinkClick}
        className={`ml-2 flex text-lg items-center font-light transition-colors w-full px-8 py-1 gap-4 ${
          isActive
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
        }`}
        title={item.title}
      >
        {item.title}
      </Link>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full text-2xl items-center justify-between px-8 py-1.5 font-light text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        {item.title}
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${
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
      <AnimatePresence initial={false}>
        {isOpen && item.children && (
          <motion.div
            className="mt-1 space-y-1 overflow-x-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {item.children.map((child, index) => (
              <MenuItem
                key={index + 'mobile-menu-item-child'}
                item={child}
                onLinkClick={onLinkClick}
                isActive={false}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MobileNavbar = () => {
  const pathname = usePathname()
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

  const toggleSidebar = useCallback(() => {
    setIsOpen((prevState) => !prevState)
  }, [])

  const closeSidebar = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
    }
  }, [isOpen])

  const handleNavItemClick = useCallback(() => {
    closeSidebar()
  }, [closeSidebar])

  const isItemActive = (href?: string): boolean =>
    Boolean(pathname === href || (href && pathname?.startsWith(`${href}/`)))

  return (
    <AnimateWrapper className="xl:hidden">
      <div className="xl:hidden sticky top-0 left-0 w-full flex justify-end items-center bg-white dark:bg-black border-gray-200 dark:border-gray-800 z-30 py-1">
        <button
          className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <HamburgerMenu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <button
          className="xl:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <motion.div
        className={`fixed xl:hidden top-0 left-0 h-screen w-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0 duration-500' : '-translate-x-full duration-500'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="xl:hidden flex justify-end items-center p-4 border-gray-200 dark:border-gray-800">
            <button
              onClick={closeSidebar}
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <Close className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index + 'mobile-menu-item'}
                  item={item}
                  onLinkClick={handleNavItemClick}
                  isActive={isItemActive(item.href)}
                />
              ))}
              <Link
                href="/support"
                onClick={handleNavItemClick}
                className={`flex text-2xl items-center font-light transition-colors w-full px-8 py-2.5 gap-4 ${
                  isItemActive('/support')
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Support
              </Link>
            </div>
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col gap-3">
              {session ? (
                <PrimaryButton
                  link="/dashboard"
                  onClick={handleNavItemClick}
                  className='w-full py-3 px-4 text-base font-medium'
                  prefixIcon={<UserSvg />}
                >
                  Dashboard
                </PrimaryButton>
              ) : (
                <>
                  <SecondaryButton
                    link="/auth/signin"
                    onClick={handleNavItemClick}
                    className='w-full py-3 px-4 text-base font-medium'
                  >
                    Log in
                  </SecondaryButton>
                  <PrimaryButton
                    link="/auth/signup"
                    onClick={handleNavItemClick}
                    className="w-full py-3 px-4 text-base font-medium"
                  >
                    Get started
                    <RightArrow />
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimateWrapper>
  )
}

export default MobileNavbar
