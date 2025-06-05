'use client'

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  isCollapsed: boolean
}

export const DashboardSidebarLoadingSkeleton = ({
  isCollapsed,
}: LoadingSkeletonProps) => {
  if (isCollapsed) {
    return <CollapsedLoadingSkeleton />
  }
  return <ExpandedLoadingSkeleton />
}

const CollapsedLoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className="flex flex-col items-center w-full space-y-4 py-2"
  >
    {[...Array(7)].map((_, i) => (
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

const ExpandedLoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="space-y-6 px-6"
  >
    {[...Array(3)].map((_, sectionIndex) => (
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
          {[...Array(2)].map((_, itemIndex) => (
            <motion.div
              key={itemIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
              className="flex items-center space-x-4 px-4 py-2"
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