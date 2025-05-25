import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'
import { Server as SocketIOServer } from 'socket.io'

export class NotificationService {
  private io: SocketIOServer

  constructor(io: SocketIOServer) {
    this.io = io
  }

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

      // Send real-time notification
      this.sendNotification(userId, type, message, link)

      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  private sendNotification(
    userId: string,
    type: NotificationType,
    message: string,
    link?: string
  ) {
    const socketId = this.io.sockets.adapter.rooms.get(userId)?.values().next().value
    if (socketId) {
      this.io.to(socketId).emit('notification', {
        type,
        message,
        link,
        timestamp: new Date(),
      })
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

      // Broadcast to all connected sockets
      this.io.emit('broadcast', {
        type,
        message,
        link,
        timestamp: new Date(),
      })

      return notifications
    } catch (error) {
      console.error('Error broadcasting message:', error)
      throw error
    }
  }
}
