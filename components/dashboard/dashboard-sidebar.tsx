'use client'
import { navItems, type UserRole } from '@/lib/dashboard-data'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Menu,
  Power,
  X,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AnimateWrapper from '../wrapper/animate-wrapper'
import { motion } from 'framer-motion'

const DashboardSidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
  const [userRole, setUserRole] = useState<UserRole>('USER')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user')
        const data = await response.json()
        setUserRole(data.type)
      } catch (error) {
        console.error('Error fetching user role:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserRole()
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsOpen((prevState) => !prevState)
  }, [])

  const closeSidebar = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
    }
  }, [isOpen])

  const toggleSubmenu = useCallback((menuName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }))
  }, [])

  const handleNavItemClick = useCallback(() => {
    closeSidebar()
  }, [closeSidebar])

  const SignOut = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await signOut({ callbackUrl: '/' })
  }

  const hasAccess = (roles?: UserRole[]) => {
    if (!roles) return true
    return roles.includes(userRole)
  }

  const renderNavItem = (item: (typeof navItems)[0]) => {
    if (loading) {
      return (
        <div
          key={item.name}
          className={`relative ${isCollapsed ? 'w-[90px]' : 'max-w-full xl:w-[250px]'}`}
        >
          <div
            className={`flex w-full text-lg items-center px-8 py-4 gap-4 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            {!isCollapsed && (
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse flex-1" />
            )}
          </div>
        </div>
      )
    }

    if (!hasAccess(item.roles)) return null

    const isActive =
      pathname === item.href || pathname?.startsWith(`${item.href}/`)
    const isSubmenuOpen = openSubmenus[item.name]

    if (item.hasSubmenu) {
      return (
        <div key={item.name} className="relative">
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`flex w-full text-lg items-center px-8 py-4 font-light transition-colors gap-4 ${
              isSubmenuOpen
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {!isCollapsed && (
              <>
                {item.name}
                <span className="ml-auto">
                  {isSubmenuOpen ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </span>
              </>
            )}
          </button>

          {isSubmenuOpen && (
            <div
              className={`${isCollapsed ? 'bg-white dark:bg-black ml-4' : ''}`}
            >
              {item.submenuItems?.map((subItem) => {
                if (!hasAccess(subItem.roles)) return null
                const isSubItemActive = pathname === subItem.href
                return (
                  <Link
                    key={subItem.name}
                    href={subItem.href || '#'}
                    className={`${isCollapsed ? 'pl-4' : 'pl-14'} flex text-base items-center py-3 font-light transition-colors gap-3 w-full ${
                      isSubItemActive
                        ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                    }`}
                    onClick={handleNavItemClick}
                  >
                    <span className="mr-2">{subItem.icon}</span>
                    {!isCollapsed && subItem.name}
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
        className={`flex text-lg items-center px-8 py-4 font-light transition-colors gap-4 w-full ${
          isActive
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
        }`}
        onClick={handleNavItemClick}
        title={isCollapsed ? item.name : ''}
      >
        <span className="mr-2">{item.icon}</span>
        {!isCollapsed && item.name}
      </Link>
    )
  }

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

      <motion.div
        className={`fixed lg:sticky top-0 left-0 h-screen w-full ${isCollapsed ? 'w-[90px]' : 'max-w-full xl:w-[250px]'} lg:h-[calc(100vh-0px)] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="hidden lg:flex justify-between items-center p-6">
            {!isCollapsed && (
              <Link href={'/'} className="text-3xl font-light">
                Home
              </Link>
            )}
            <div className="flex mt-0.5 justify-end">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`p-2 cursor-pointer bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors mx-auto`}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="lg:hidden flex justify-end items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={closeSidebar}
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6">
            {navItems.map(renderNavItem)}
          </nav>
          <button
            className="bg-red-500 px-8 py-4 text-white cursor-pointer flex items-center justify-center hover:bg-red-600 transition-colors w-full gap-3"
            onClick={() => {
              toast.promise(SignOut(), {
                loading: 'Logging out...',
                success: 'Logged out successfully',
                error: 'Failed to log out',
              })
            }}
          >
            <Power className="w-5 h-5 md:mr-2" />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </motion.div>
    </AnimateWrapper>
  )
}

export default DashboardSidebar
