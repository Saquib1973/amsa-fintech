'use client'
import { navItems } from '@/lib/dashboard-data'
import { ChevronDown, ChevronRight, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import AnimateWrapper from '../wrapper/animate-wrapper'

const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        callback()
      }
    },
    [callback]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  return ref
}

const DashboardSidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setIsOpen((prevState) => !prevState)
  }, [])

  const closeSidebar = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
    }
  }, [isOpen])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prevState) => !prevState)
  }, [])

  const handleNavItemClick = useCallback(() => {
    closeSidebar()
  }, [closeSidebar])

  const sidebarRef = useClickOutside(closeSidebar)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  const isInSettingsSubmenu = pathname?.startsWith('/settings/')

  return (
      <AnimateWrapper className='w-fit'>
        <div className="flex w-full justify-between items-center xl:hidden bg-white text-black dark:text-white dark:bg-black border-b border-gray-200 dark:border-gray-800 max-lg:py-3 absolute top-0 left-0 z-30  px-6 py-2">
          <Link href={'/'} className="text-xl font-light">
            Home
          </Link>
          <button className="p-2 cursor-pointer" onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isOpen && (
          <button
            className="xl:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeSidebar}
          />
        )}

        <div
          ref={sidebarRef}
          id="sidebar"
          className={`xl:translate-x-0 xl:static fixed top-0 left-0 h-screen md:pt-4 bg-white text-black dark:text-white dark:bg-black w-full xl:w-[300px] border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-500 ease-in-out z-50 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Link href={'/'} className="max-xl:hidden p-4 text-3xl font-light">
            Home
          </Link>
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-end items-center">
            <button
              onClick={closeSidebar}
              className="p-2 cursor-pointer rounded-lg xl:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col h-full">
            <nav className="flex-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`)

                if (item.hasSubmenu) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={toggleSettings}
                        className={`flex w-full text-xl items-center p-4 font-light rounded-md ${
                          isInSettingsSubmenu
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                        <span className="ml-auto">
                          {isSettingsOpen ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </span>
                      </button>

                      {isSettingsOpen && (
                        <div className="">
                          {item.submenuItems?.map((subItem) => {
                            const isSubItemActive = pathname === subItem.href
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href || '#'}
                                className={`pl-12 flex text-lg items-center p-3 font-light ${
                                  isSubItemActive
                                    ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                                }`}
                                onClick={handleNavItemClick}
                              >
                                <span className="mr-3">{subItem.icon}</span>
                                {subItem.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href ?? '#'}
                    className={`flex text-xl items-center p-4 font-light ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                    }`}
                    onClick={handleNavItemClick}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-800">
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </AnimateWrapper>
  )
}

export default DashboardSidebar
