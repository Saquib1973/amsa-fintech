'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Menu,
  X,
} from 'lucide-react'
import { HeaderProps } from './types'
import SearchModalButton from '@/components/ui/search-component'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const MobileHeader = ({
  toggleSidebar,
}: {
  toggleSidebar: () => void
}) => {
  const [history, setHistory] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHistory(window.history.length > 1)
    }

    return () => {
      setHistory(false)
    }
  }, [])

  const router = useRouter()

  const pathname = usePathname()
  return (
    <div className="lg:hidden sticky top-0 left-0 w-full flex justify-between items-center bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-30 px-4 py-3">
      <AnimatePresence mode="wait">
        {!history || pathname === '/dashboard' ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={'/'} className="text-xl font-light">
              Home
            </Link>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.5 }}
            onClick={() => router.back()}
            className="text-xl font-light flex items-center justify-center  cursor-pointer gap-2"
          >
            <ArrowLeft className="size-5" />
            <span>Back</span>
          </motion.button>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2">
        <SearchModalButton />
        <button
          className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export const DesktopHeader = ({ isCollapsed, setIsCollapsed }: HeaderProps) => (
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
)

export const MobileCloseButton = ({
  closeSidebar,
}: {
  closeSidebar: () => void
}) => (
  <div className="lg:hidden flex justify-end items-center p-4">
    <button
      onClick={closeSidebar}
      className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Close sidebar"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
)
