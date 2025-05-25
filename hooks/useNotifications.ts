import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { NotificationType } from '@prisma/client'
import { NOTIFICATION_POLL_INTERVAL } from '@/app/api/auth/constants'

interface Notification {
  id: string
  type: NotificationType
  message: string
  link?: string | null
  createdAt: string
  read: boolean
  createdBy?: {
    name: string
    email: string
  }
}

export const useNotifications = (
  pollInterval = NOTIFICATION_POLL_INTERVAL,
  showToasts = true
) => {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const lastPollTimeRef = useRef<Date | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch all notifications on initial load
  const fetchAllNotifications = useCallback(async () => {
    if (!session?.user?.id) return
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setNotifications(data.notifications || [])
      if (data.notifications?.length > 0) {
        lastPollTimeRef.current = new Date(data.notifications[0].createdAt)
      } else {
        lastPollTimeRef.current = new Date()
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      if (showToasts) toast.error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, showToasts])

  const fetchNewNotifications = useCallback(async () => {
    if (!session?.user?.id || !lastPollTimeRef.current) return
    try {
      const response = await fetch('/api/notifications?' + new URLSearchParams({
        since: lastPollTimeRef.current.toISOString()
      }))
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      if (data.notifications?.length > 0) {
        setNotifications(prev => {
          const newNotifications = data.notifications.filter(
            (newNotif: Notification) => !prev.some(p => p.id === newNotif.id)
          )
          if (showToasts) {
            newNotifications.forEach((notif: Notification) => {
              toast(notif.message, { icon: '🔔', duration: 5000 })
            })
          }
          return [...newNotifications, ...prev]
        })
        lastPollTimeRef.current = new Date(data.notifications[0].createdAt)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      if (showToasts) toast.error('Failed to fetch notifications')
    }
  }, [session?.user?.id, showToasts])

  useEffect(() => {
    fetchAllNotifications()
  }, [fetchAllNotifications])

  useEffect(() => {
    if (!session?.user?.id) return
    pollIntervalRef.current = setInterval(fetchNewNotifications, pollInterval)
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [session?.user?.id, fetchNewNotifications, pollInterval])

  return {
    notifications,
    loading,
    refetch: fetchAllNotifications
  }
}