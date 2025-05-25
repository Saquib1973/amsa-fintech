'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BroadcastMessage from '@/components/broadcast/broadcast-message'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationType } from '@prisma/client'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'

export default function SuperAdminBroadcastPage() {
  const [activeTab, setActiveTab] = useState('send')
  const { notifications, loading, refetch } = useNotifications()

  return (
    <div className="">
      <OffWhiteHeadingContainer>
        <div className="flex max-md:flex-col justify-between items-center">
          <h1 className="text-4xl font-light">Broadcast Management</h1>
        </div>
      </OffWhiteHeadingContainer>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6 p-2 md:p-6"
      >
        <TabsList>
          <TabsTrigger value="send">Send Broadcast</TabsTrigger>
          <TabsTrigger value="history">Broadcast History</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <BroadcastMessage onSuccess={refetch} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No broadcast messages yet
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications
                    .filter(
                      (notification) =>
                        notification.type ===
                          NotificationType.BROADCAST_MESSAGE ||
                        notification.type ===
                          NotificationType.BROADCAST_ALERT ||
                        notification.type === NotificationType.BROADCAST_UPDATE
                    )
                    .map((notification) => (
                      <Card key={notification.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {notification.createdBy?.name || 'System'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                          {notification.link && (
                            <a
                              href={notification.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {notification.link}
                            </a>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                              {notification.type}
                            </span>
                            {!notification.read && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}