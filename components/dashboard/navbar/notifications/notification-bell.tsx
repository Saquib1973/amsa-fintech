"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Bell, Check, ChevronDown, ChevronUp, MailOpen, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import NotificationLoader from "@/components/loader-skeletons/notification-loader";

type NotificationTab = "all" | "unread" | "broadcast";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  link?: string | null;
  createdAt: string;
  read: boolean;
  createdBy?: {
    name: string;
    email: string;
  };
}

// Constants
const BROADCAST_NOTIFICATION_TYPES = [
  NotificationType.BROADCAST_MESSAGE,
  NotificationType.BROADCAST_ALERT,
  NotificationType.BROADCAST_UPDATE,
] as const;

const NOTIFICATION_ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  [NotificationType.SYSTEM_MESSAGE]: Bell,
  [NotificationType.TRANSACTION_CREATED]: MessageSquare,
  [NotificationType.TRANSACTION_SUCCESSFUL]: MessageSquare,
  [NotificationType.TRANSACTION_FAILED]: MessageSquare,
  [NotificationType.WALLET_CREDITED]: MessageSquare,
  [NotificationType.WALLET_DEBITED]: MessageSquare,
  [NotificationType.NEW_LOGIN_DETECTED]: AlertCircle,
  [NotificationType.PASSWORD_CHANGED]: AlertCircle,
  [NotificationType.KYC_VERIFIED]: Check,
  [NotificationType.KYC_REJECTED]: Check,
  [NotificationType.ACCOUNT_VERIFICATION]: Check,
  [NotificationType.PRICE_ALERT]: AlertCircle,
  [NotificationType.BROADCAST_MESSAGE]: MessageSquare,
  [NotificationType.BROADCAST_ALERT]: MessageSquare,
  [NotificationType.BROADCAST_UPDATE]: MessageSquare,
};

const isBroadcastNotification = (type: NotificationType): boolean => {
  return BROADCAST_NOTIFICATION_TYPES.includes(type as typeof BROADCAST_NOTIFICATION_TYPES[number]);
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [expandedNotifications, setExpandedNotifications] = useState<Record<string, boolean>>({});
  const { notifications, loading, refetch } = useNotifications();
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized values
  const unreadCount = useMemo(() =>
    notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const broadcastCount = useMemo(() =>
    notifications.filter((n) => isBroadcastNotification(n.type)).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() =>
    notifications.filter((notification) => {
      switch (activeTab) {
        case "unread":
          return !notification.read;
        case "broadcast":
          return isBroadcastNotification(notification.type);
        default:
          return true;
      }
    }),
    [notifications, activeTab]
  );

  // Click outside handler
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        bellRef.current &&
        !bellRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // API handlers
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      await refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  }, [refetch]);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      const responses = await Promise.all(
        unreadNotifications.map((n) =>
          fetch(`/api/notifications/${n.id}/read`, {
            method: "POST",
          })
        )
      );

      const hasError = responses.some(response => !response.ok);
      if (hasError) {
        throw new Error('Some notifications failed to be marked as read');
      }

      await refetch();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  }, [notifications, refetch]);

  const getNotificationIcon = useCallback((type: NotificationType) => {
    const Icon = NOTIFICATION_ICONS[type] || Bell;
    return <Icon className="w-5 h-5" />;
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedNotification(null);
  }, []);

  const getNotificationStateClass = (isRead: boolean): string => {
    return isRead ? "bg-gray-100" : "bg-blue-100";
  };

  const handleExpandToggle = (id: string) => {
    setExpandedNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      await refetch();
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const renderNotificationDetail = (notification: Notification) => {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notifications
        </Button>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-full ${getNotificationStateClass(notification.read)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  {notification.type.replace(/_/g, " ")}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{notification.message}</p>
              {notification.link && (
                <Link
                  href={notification.link}
                  className="inline-flex items-center text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationListContent = () => {
    if (loading) {
      return <NotificationLoader />;
    }
    if (filteredNotifications.length === 0) {
      return <div className="text-center py-8 text-gray-500">No {activeTab} notifications</div>;
    }
    return (
      <div className="divide-y divide-gray-200">
        {filteredNotifications.map((notification) => {
          const expanded = expandedNotifications[notification.id];
          return (
            <div
              key={notification.id}
              className={`group p-4 flex flex-col gap-2 transition ${!notification.read ? 'text-black' : 'text-gray-700'}`}
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`p-2 rounded-full ${getNotificationStateClass(notification.read)}`}>{getNotificationIcon(notification.type)}</div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm truncate max-w-xs">{notification.type.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                  </div>
                  {!notification.read && (
                    <Badge variant="secondary" className="text-xs ml-1">New</Badge>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  {!notification.read && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      aria-label="Mark as Read"
                      title="Mark as Read"
                    >
                      <MailOpen className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(notification.id)}
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleExpandToggle(notification.id)}
                    aria-label={expanded ? 'Show less' : 'Show more'}
                    title={expanded ? 'Show less' : 'Show more'}
                  >
                    {expanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    className="mt-2 text-sm text-gray-600"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {notification.message}
                    {notification.link && (
                      <div className="mt-1">
                        <Link
                          href={notification.link}
                          className="inline-flex items-center text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details →
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <button
        ref={bellRef}
        className="relative p-2 rounded-full hover:bg-gray-100 outline-none focus:bg-gray-100"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-2 mt-1 w-[450px] h-[600px] max-w-[90vw] bg-white rounded-lg shadow-lg z-50 border p-0"
          style={{ minWidth: 320 }}
          role="dialog"
          aria-label="Notifications panel"
          tabIndex={-1}
        >
          {selectedNotification ? (
            renderNotificationDetail(selectedNotification)
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-sm"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationTab)}>
                <div className="px-4 pt-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1">
                      Unread
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="broadcast" className="flex-1">
                      Broadcast
                      {broadcastCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {broadcastCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="h-[470px]">
                  <div className="p-4">
                    {renderNotificationListContent()}
                  </div>
                </ScrollArea>
              </Tabs>
            </>
          )}
        </div>
      )}
    </div>
  );
}