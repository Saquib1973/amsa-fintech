import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

export class NotificationService {
  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
    link?: string
  ) {
    try {
      // Create notification in database
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          message,
          link,
        },
      })

      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  async broadcastMessage(
    message: string,
    type: NotificationType = NotificationType.SYSTEM_MESSAGE,
    link?: string
  ) {
    try {
      // Get all users
      const users = await prisma.user.findMany({
        select: { id: true },
      })

      // Create notifications for all users
      const notifications = await Promise.all(
        users.map(user =>
          prisma.notification.create({
            data: {
              userId: user.id,
              type,
              message,
              link,
            },
          })
        )
      )

      return notifications
    } catch (error) {
      console.error('Error broadcasting message:', error)
      throw error
    }
  }

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }
}
