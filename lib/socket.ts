import { Server as SocketIOServer } from 'socket.io'
import { NotificationType } from '@prisma/client'

let io: SocketIOServer | null = null

export const initSocket = () => {
  if (!io) {
    io = new SocketIOServer({
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || '*',
        methods: ['GET', 'POST'],
      },
    })

    // Store user socket connections
    const userSockets = new Map<string, string>()

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Handle user authentication
      socket.on('authenticate', (userId: string) => {
        userSockets.set(userId, socket.id)
        socket.join(userId) // Join user's room
        console.log(`User ${userId} authenticated with socket ${socket.id}`)
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        // Remove user from the map
        for (const [userId, socketId] of Array.from(userSockets.entries())) {
          if (socketId === socket.id) {
            userSockets.delete(userId)
            socket.leave(userId) // Leave user's room
            console.log(`User ${userId} disconnected`)
            break
          }
        }
      })
    })
  }
  return io
}

// Function to send notification to a specific user
export const sendNotification = (
  userId: string,
  type: NotificationType,
  message: string,
  link?: string
) => {
  if (!io) {
    console.error('Socket server not initialized')
    return
  }

  io.to(userId).emit('notification', {
    type,
    message,
    link,
    timestamp: new Date(),
  })
}

// Function to broadcast to all users
export const broadcastToAll = (
  type: NotificationType,
  message: string,
  link?: string
) => {
  if (!io) {
    console.error('Socket server not initialized')
    return
  }

  io.emit('broadcast', {
    type,
    message,
    link,
    timestamp: new Date(),
  })
}

// Get the socket instance
export const getSocket = () => io
