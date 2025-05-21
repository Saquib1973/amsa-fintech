'use client'
import { navSections, type UserRole } from '@/lib/dashboard-data'
import {
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Menu,
  Power,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AnimateWrapper from '../wrapper/animate-wrapper'
import { motion, AnimatePresence } from 'framer-motion'

const DashboardSidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('USER')
  const [loading, setLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [title: string]: boolean }>({})

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

  useEffect(() => {
    if (navSections.length > 0) {
      setExpandedSections({ [navSections[0].title]: true })
    }
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

  const SignOut = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await signOut({ callbackUrl: '/' })
  }

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const LoadingSkeleton = () => {
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
            {/* Section header skeleton */}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            {/* Section items skeleton */}
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
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingSkeleton />
              ) : isCollapsed ? (
                <div className="flex flex-col items-center">
                  {navSections
                    .filter(section => !section.roles || section.roles.includes(userRole))
                    .flatMap(section =>
                      section.items
                        .filter(item => !item.roles || item.roles.includes(userRole))
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    )
                    .map(item => (
                      <div key={item.name} className="flex justify-center w-full">
                        <Link
                          href={item.href ?? '#'}
                          className={`flex text-lg items-center justify-center py-4 w-full transition-colors ${
                            pathname === item.href || pathname?.startsWith(`${item.href}/`)
                              ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                          }`}
                          onClick={handleNavItemClick}
                          title={item.name}
                        >
                          {item.icon}
                        </Link>
                      </div>
                    ))}
                </div>
              ) : (
                navSections
                  .filter(section => !section.roles || section.roles.includes(userRole))
                  .map((section) => {
                    const isExpanded = expandedSections[section.title] || false;
                    return (
                      <div key={section.title} className="mb-4">
                        <button
                          className="flex items-center w-full px-8 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none"
                          onClick={() => toggleSection(section.title)}
                          aria-expanded={isExpanded}
                        >
                          <span className="mr-2">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </span>
                          {section.title}
                        </button>
                        {isExpanded && (
                          <div className="w-full">
                            {section.items
                              .filter(item => !item.roles || item.roles.includes(userRole))
                              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                              .map((item) => (
                                <div key={item.name}>
                                  <Link
                                    href={item.href ?? '#'}
                                    className={`flex text-lg items-center px-8 py-4 font-light transition-colors gap-4 w-full ${
                                      pathname === item.href || pathname?.startsWith(`${item.href}/`)
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100'
                                    }`}
                                    onClick={handleNavItemClick}
                                    title={item.name}
                                  >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                  </Link>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </AnimatePresence>
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
