"use client";

import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationType } from "@prisma/client";

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
        return "🔔";
      case NotificationType.TRANSACTION_CREATED:
      case NotificationType.TRANSACTION_SUCCESSFUL:
      case NotificationType.TRANSACTION_FAILED:
        return "💰";
      case NotificationType.WALLET_CREDITED:
      case NotificationType.WALLET_DEBITED:
        return "💳";
      case NotificationType.NEW_LOGIN_DETECTED:
      case NotificationType.PASSWORD_CHANGED:
        return "🔒";
      case NotificationType.KYC_VERIFIED:
      case NotificationType.KYC_REJECTED:
        return "📝";
      case NotificationType.ACCOUNT_VERIFICATION:
        return "✅";
      case NotificationType.PRICE_ALERT:
        return "📊";
      case NotificationType.BROADCAST_MESSAGE:
        return "📢";
      case NotificationType.BROADCAST_ALERT:
        return "⚠️";
      case NotificationType.BROADCAST_UPDATE:
        return "📢";
      default:
        return "📨";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "All notifications"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                      notification.read ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {notification.type.replace(/_/g, " ")}
                          </p>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600">{notification.message}</p>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Link →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}