'use client'
import { navItems } from '@/lib/dashboard-data'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import AnimateWrapper from '../wrapper/animate-wrapper'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'

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

  const SignOut = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await signOut({ callbackUrl: '/' })
  }
  const isInSettingsSubmenu = pathname?.startsWith('/settings/')

  return (
    <AnimateWrapper className="lg:w-fit">
      <div className="lg:hidden sticky top-0 left-0 w-full flex justify-between items-center bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-30 px-4 py-3">
        <Link href={'/'} className="text-xl font-light">
          Home
        </Link>
        <button
          className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <button
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed lg:sticky top-0 left-0 h-screen w-full lg:h-[calc(100vh-0px)] bg-white dark:bg-black lg:w-[230px] xl:w-[300px] border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <Link href={'/'} className="hidden lg:block p-4 text-3xl font-light">
            Home
          </Link>

          <div className="lg:hidden flex justify-end items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={closeSidebar}
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`)

              if (item.hasSubmenu) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={toggleSettings}
                      className={`flex w-full text-lg items-center p-4 font-light transition-colors ${
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
                              className={`pl-10 flex text-base items-center p-3 font-light transition-colors ${
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
                  className={`flex text-lg items-center p-4 font-light transition-colors ${
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
          <button
            className="bg-red-500 p-4 text-white cursor-pointer flex items-center justify-center"
            onClick={() => {
              toast.promise(SignOut(), {
                loading: 'Logging out...',
                success: 'Logged out successfully',
                error: 'Failed to log out',
              })
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardSidebar
