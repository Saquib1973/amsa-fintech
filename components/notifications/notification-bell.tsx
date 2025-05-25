"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, AlertCircle, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { NotificationType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";

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

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { notifications, loading, refetch } = useNotifications();
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside logic
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
        return <Bell className="w-5 h-5" />;
      case NotificationType.TRANSACTION_CREATED:
      case NotificationType.TRANSACTION_SUCCESSFUL:
      case NotificationType.TRANSACTION_FAILED:
        return <MessageSquare className="w-5 h-5" />;
      case NotificationType.WALLET_CREDITED:
      case NotificationType.WALLET_DEBITED:
        return <MessageSquare className="w-5 h-5" />;
      case NotificationType.NEW_LOGIN_DETECTED:
      case NotificationType.PASSWORD_CHANGED:
        return <AlertCircle className="w-5 h-5" />;
      case NotificationType.KYC_VERIFIED:
      case NotificationType.KYC_REJECTED:
        return <Check className="w-5 h-5" />;
      case NotificationType.ACCOUNT_VERIFICATION:
        return <Check className="w-5 h-5" />;
      case NotificationType.PRICE_ALERT:
        return <AlertCircle className="w-5 h-5" />;
      case NotificationType.BROADCAST_MESSAGE:
      case NotificationType.BROADCAST_ALERT:
      case NotificationType.BROADCAST_UPDATE:
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const broadcastCount = notifications.filter((n) =>
    n.type === NotificationType.BROADCAST_MESSAGE ||
    n.type === NotificationType.BROADCAST_ALERT ||
    n.type === NotificationType.BROADCAST_UPDATE
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    switch (activeTab) {
      case "unread":
        return !notification.read;
      case "broadcast":
        return (
          notification.type === NotificationType.BROADCAST_MESSAGE ||
          notification.type === NotificationType.BROADCAST_ALERT ||
          notification.type === NotificationType.BROADCAST_UPDATE
        );
      default:
        return true;
    }
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const handleBackClick = () => {
    setSelectedNotification(null);
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
            <div className={`p-3 rounded-full ${
              notification.read ? "bg-gray-100" : "bg-blue-100"
            }`}>
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

  return (
    <div className="relative inline-block">
      <button
        ref={bellRef}
        className="relative p-2 rounded-full hover:bg-gray-100"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-2 mt-1 w-[450px] h-[600px] max-w-[90vw] bg-white rounded-lg shadow-lg z-50 border"
          style={{ minWidth: 320 }}
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
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : filteredNotifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No {activeTab} notifications
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                              notification.read ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${
                                notification.read ? "bg-gray-100" : "bg-blue-100"
                              }`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">
                                      {notification.type.replace(/_/g, " ")}
                                    </p>
                                    {!notification.read && (
                                      <Badge variant="secondary" className="text-xs">
                                        New
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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