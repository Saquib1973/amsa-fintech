'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { dashboardSidebarItems as sidebarItems } from '@/lib/dashboard-data'
import { type UserRole } from '@/types/user'
import AnimateWrapper from '../../wrapper/animate-wrapper'
import { MobileHeader, DesktopHeader, MobileCloseButton } from './header'
import { NavigationContent } from './navigation-content'
import { Power } from 'lucide-react'
import toast from 'react-hot-toast'

const DashboardSidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
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

  const handleNavItemClick = useCallback(() => {
    closeSidebar()
  }, [closeSidebar])

  const handleSignOut = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await signOut({ callbackUrl: '/' })
  }

  const filteredNavItems = sidebarItems
    .filter((section) => !section.roles || section.roles.includes(userRole))
    .flatMap((section) =>
      section.items
        .filter((item) => !item.roles || item.roles.includes(userRole))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    )

  const isItemActive = (href?: string): boolean =>
    Boolean(pathname === href || (href && pathname?.startsWith(`${href}/`)))

  return (
    <AnimateWrapper className="lg:w-fit">
      <MobileHeader toggleSidebar={toggleSidebar} />

      {isOpen && (
        <button
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <motion.div
        className={`fixed lg:sticky top-0 left-0 h-screen w-full lg:h-[calc(100vh-0px)] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out z-50 ${
          isCollapsed ? 'w-[90px]' : 'max-w-full xl:w-[250px]'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          <DesktopHeader
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          <MobileCloseButton closeSidebar={closeSidebar} />

          <nav className="flex-1 overflow-y-auto py-6">
            <NavigationContent
              loading={loading}
              isCollapsed={isCollapsed}
              filteredNavItems={filteredNavItems}
              navSections={sidebarItems}
              userRole={userRole}
              isItemActive={isItemActive}
              handleNavItemClick={handleNavItemClick}
            />
          </nav>

          <button
            className="bg-red-500 px-8 py-4 text-white cursor-pointer flex items-center justify-center hover:bg-red-600 transition-colors w-full gap-3"
            onClick={() => {
              toast.promise(handleSignOut(), {
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
