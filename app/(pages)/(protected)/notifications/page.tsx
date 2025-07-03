"use client";

import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationType } from "@prisma/client";
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import NotificationSkeleton from '@/components/loader-skeletons/notification-skeleton'
import { Bell, Check, AlertCircle, MessageSquare, CheckCircle } from 'lucide-react'
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define Notification type
type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  link?: string | null;
  createdAt: string;
  read: boolean;
};

function groupNotificationsByDate(notifications: Notification[]) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const groups: Record<string, Notification[]> = {};
  notifications.forEach((n) => {
    const date = new Date(n.createdAt);
    let group = 'Earlier';
    if (isSameDay(date, today)) group = 'Today';
    else if (isSameDay(date, yesterday)) group = 'Yesterday';
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  });
  return groups;
}

export default function NotificationsPage() {
  const { notifications, loading, refetch } = useNotifications(undefined, false);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      });
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((n) =>
          fetch(`/api/notifications/${n.id}/read`, {
            method: "POST",
          })
        )
      );
      refetch();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM_MESSAGE:
        return <Bell className="w-5 h-5 text-blue-500" />;
      case NotificationType.TRANSACTION_CREATED:
      case NotificationType.TRANSACTION_SUCCESSFUL:
      case NotificationType.TRANSACTION_FAILED:
      case NotificationType.WALLET_CREDITED:
      case NotificationType.WALLET_DEBITED:
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case NotificationType.NEW_LOGIN_DETECTED:
      case NotificationType.PASSWORD_CHANGED:
      case NotificationType.PRICE_ALERT:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case NotificationType.KYC_VERIFIED:
      case NotificationType.KYC_REJECTED:
      case NotificationType.ACCOUNT_VERIFICATION:
        return <Check className="w-5 h-5 text-purple-500" />;
      case NotificationType.BROADCAST_MESSAGE:
      case NotificationType.BROADCAST_ALERT:
      case NotificationType.BROADCAST_UPDATE:
        return <MessageSquare className="w-5 h-5 text-pink-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Group notifications by date
  const grouped = useMemo(() => groupNotificationsByDate(notifications), [notifications]);
  const groupOrder = ['Today', 'Yesterday', 'Earlier'];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <OffWhiteHeadingContainer>
        <div>
          <h1 className="text-4xl font-light">Notifications</h1>
          <p className="text-xl text-gray-500 mt-2 font-light">All your updates in one place</p>
        </div>
      </OffWhiteHeadingContainer>
      <SectionWrapper className="py-6 md:py-12">
        <div className="w-full">
          <div className="flex justify-end items-center mb-6">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="text-sm"
              >
                Mark all as read
              </Button>
            )}
          </div>
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-8"
                >
                  <NotificationSkeleton count={5} />
                </motion.div>
              ) : notifications.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="py-16 text-center text-gray-400 text-lg"
                >
                  <Bell className="mx-auto mb-4 w-10 h-10 text-gray-300" />
                  <div>No notifications yet</div>
                  <div className="text-sm text-gray-300 mt-2">You&apos;re all caught up!</div>
                </motion.div>
              ) : (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {groupOrder.map((group) =>
                    grouped[group] && grouped[group].length > 0 ? (
                      <motion.div
                        key={group}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <div className="px-4 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {group}
                        </div>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                          {grouped[group].map((notification, index) => (
                            <motion.li
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: "easeOut"
                              }}
                              className={
                                'flex items-start gap-3 px-3 py-2 group transition-colors bg-white dark:bg-gray-950 border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-gray-100 dark:border-gray-800'
                              }
                              style={{ minHeight: '64px' }}
                            >
                              <div className="mt-2 shrink-0 w-2 flex justify-center">
                                {!notification.read && (
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" title="Unread" />
                                )}
                              </div>
                              <div className="mt-1 shrink-0">
                                <span className="inline-flex items-center justify-center w-5 h-5">
                                  {getNotificationIcon(notification.type)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`capitalize ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'font-normal text-gray-900 dark:text-white'} text-[15px]`}>
                                    {notification.type.replace(/_/g, ' ').toLowerCase()}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                                  {notification.message}
                                </p>
                                {notification.link && (
                                  <Link
                                    href={notification.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 text-xs text-blue-600 hover:underline inline-block"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    View Details →
                                  </Link>
                                )}
                              </div>
                              {!notification.read && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Mark as read"
                                  onClick={() => markAsRead(notification.id)}
                                  className="ml-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </motion.button>
                              )}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}