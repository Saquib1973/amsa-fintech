import { motion } from "framer-motion";

interface NotificationSkeletonProps {
  count?: number;
}

export default function NotificationSkeleton({ count = 5 }: NotificationSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="space-y-4">
      {skeletons.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className="flex items-start gap-3 px-3 py-2"
          style={{ minHeight: '64px' }}
        >
          {/* Unread indicator skeleton */}
          <div className="mt-2 shrink-0 w-2 flex justify-center">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Icon skeleton */}
          <div className="mt-1 shrink-0">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title skeleton */}
            <div className="flex items-center justify-between">
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"
              />
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"
              />
            </div>

            {/* Message skeleton */}
            <div className="space-y-1">
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"
              />
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1.0 }}
                className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}