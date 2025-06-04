'use client'
import { navSections, type UserRole } from '@/lib/dashboard-data'
import {
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Menu,
  Power,
  X,
  ArrowLeft,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AnimateWrapper from '../wrapper/animate-wrapper'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  name: string
  href?: string
  icon: React.ReactNode
  roles?: UserRole[]
  order?: number
  hasSubmenu?: boolean
  submenuItems?: NavItem[]
}

interface NavSection {
  title: string
  items: NavItem[]
  roles?: UserRole[]
}

interface NavLinkProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
  isCollapsed?: boolean
}

const NavLink = ({ item, isActive, onClick, isCollapsed }: NavLinkProps) => {
  const baseClasses = "flex text-lg items-center font-light transition-colors w-full"
  const activeClasses = "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
  const inactiveClasses = "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100"

  if (isCollapsed) {
    return (
      <div className="flex justify-center w-full">
        <Link
          href={item.href ?? '#'}
          className={`${baseClasses} justify-center py-4 ${isActive ? activeClasses : inactiveClasses}`}
          onClick={onClick}
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
        className={`${baseClasses} px-8 py-4 gap-4 ${isActive ? activeClasses : inactiveClasses}`}
        onClick={onClick}
        title={item.name}
      >
        <span className="mr-2">{item.icon}</span>
        {item.name}
      </Link>
    </div>
  )
}

const LoadingSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center w-full space-y-4 py-2"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 px-6"
    >
      {[...Array(4)].map((_, sectionIndex) => (
        <motion.div
          key={sectionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="space-y-2 pl-2">
            {[...Array(3)].map((_, itemIndex) => (
              <motion.div
                key={itemIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                className="flex items-center space-x-4 px-4 py-3"
              >
                <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

const NavigationContent = ({
  loading,
  isCollapsed,
  filteredNavItems,
  navSections,
  userRole,
  isItemActive,
  handleNavItemClick
}: {
  loading: boolean
  isCollapsed: boolean
  filteredNavItems: NavItem[]
  navSections: NavSection[]
  userRole: UserRole
  isItemActive: (href?: string) => boolean
  handleNavItemClick: () => void
}) => {
  const pathname = usePathname()
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const findSubmenu = () => {
      for (const section of navSections) {
        for (const item of section.items) {
          if (item.hasSubmenu && item.submenuItems) {
            const hasActiveSubmenu = item.submenuItems.some(subItem =>
              pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
            )
            if (hasActiveSubmenu) {
              return item
            }
          }
        }
      }
      return null
    }
    const newSubmenu = findSubmenu()
    if (newSubmenu !== activeSubmenu) {
      setIsTransitioning(true)
    }
    setActiveSubmenu(newSubmenu)
  }, [pathname, navSections])

  const handleSubmenuChange = (item: NavItem | null) => {
    setIsTransitioning(true)
    setActiveSubmenu(item)
  }

  if (loading) {
    return <LoadingSkeleton isCollapsed={isCollapsed} />
  }

  const MainMenu = () => (
    <motion.div
      initial={isTransitioning ? { opacity: 0, x: -10 } : undefined}
      animate={{ opacity: 1, x: 0 }}
      exit={isTransitioning ? { opacity: 0, x: 10 } : undefined}
      transition={{ duration: 0.2 }}
      onAnimationComplete={() => setIsTransitioning(false)}
    >
      {navSections
        .filter((section: NavSection) => !section.roles || section.roles.includes(userRole))
        .map((section: NavSection) => (
          <div key={section.title} className="mb-4">
            <div className="px-8 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </div>
            <div className="w-full">
              {section.items
                .filter((item: NavItem) => !item.roles || item.roles.includes(userRole))
                .sort((a: NavItem, b: NavItem) => (a.order ?? 0) - (b.order ?? 0))
                .map((item) => (
                  <NavLink
                    key={item.name}
                    item={item}
                    isActive={isItemActive(item.href)}
                    onClick={() => {
                      if (item.hasSubmenu) {
                        handleSubmenuChange(item)
                      } else {
                        handleNavItemClick()
                      }
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
    </motion.div>
  )

  const SubMenu = () => (
    <motion.div
      initial={isTransitioning ? { opacity: 0, x: -10 } : undefined}
      animate={{ opacity: 1, x: 0 }}
      exit={isTransitioning ? { opacity: 0, x: 10 } : undefined}
      transition={{ duration: 0.2 }}
      onAnimationComplete={() => setIsTransitioning(false)}
      className="flex flex-col h-full"
    >
      <button
        onClick={() => handleSubmenuChange(null)}
        className="flex items-center gap-2 px-8 py-4 text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Menu</span>
      </button>
      <div className="flex-1">
        {activeSubmenu?.submenuItems?.map((item) => (
          <NavLink
            key={item.name}
            item={item}
            isActive={isItemActive(item.href)}
            onClick={handleNavItemClick}
          />
        ))}
      </div>
    </motion.div>
  )

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center">
        {activeSubmenu ? (
          <>
            <button
              onClick={() => handleSubmenuChange(null)}
              className="flex items-center justify-center w-full py-4 text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
              title="Back to Menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {activeSubmenu.submenuItems?.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={isItemActive(item.href)}
                onClick={handleNavItemClick}
                isCollapsed={true}
              />
            ))}
          </>
        ) : (
          filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              item={item}
              isActive={isItemActive(item.href)}
              onClick={() => {
                if (item.hasSubmenu) {
                  handleSubmenuChange(item)
                } else {
                  handleNavItemClick()
                }
              }}
              isCollapsed={true}
            />
          ))
        )}
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {activeSubmenu ? <SubMenu key="submenu" /> : <MainMenu key="main" />}
    </AnimatePresence>
  )
}

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

  const filteredNavItems = navSections
    .filter((section: NavSection) => !section.roles || section.roles.includes(userRole))
    .flatMap((section: NavSection) =>
      section.items
        .filter((item: NavItem) => !item.roles || item.roles.includes(userRole))
        .sort((a: NavItem, b: NavItem) => (a.order ?? 0) - (b.order ?? 0))
    )

  const isItemActive = (href?: string): boolean =>
    Boolean(pathname === href || (href && pathname?.startsWith(`${href}/`)))

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
        className={`fixed lg:sticky top-0 left-0 h-screen w-full ${
          isCollapsed ? 'w-[90px]' : 'max-w-full xl:w-[250px]'
        } lg:h-[calc(100vh-0px)] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out z-50 ${
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
                className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors mx-auto"
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
            <AnimatePresence mode="wait">
              <NavigationContent
                loading={loading}
                isCollapsed={isCollapsed}
                filteredNavItems={filteredNavItems}
                navSections={navSections}
                userRole={userRole}
                isItemActive={isItemActive}
                handleNavItemClick={handleNavItemClick}
              />
            </AnimatePresence>
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
