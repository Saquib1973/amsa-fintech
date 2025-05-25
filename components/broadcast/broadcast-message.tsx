'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NotificationType } from '@prisma/client'
import UserSelector from './user-selector'
import { toast } from 'react-hot-toast'

interface BroadcastMessageProps {
  onSuccess?: () => void
}

export default function BroadcastMessage({ onSuccess }: BroadcastMessageProps) {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<NotificationType>(NotificationType.SYSTEM_MESSAGE)
  const [link, setLink] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user')
      return
    }

    setIsSending(true)
    try {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          type,
          link: link.trim() || undefined,
          userIds: selectedUsers,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send broadcast')
      }

      toast.success('Message broadcasted successfully')

      // Reset form
      setMessage('')
      setLink('')
      setSelectedUsers([])

      // Call onSuccess callback if provided
      onSuccess?.()
    } catch (error) {
      console.error('Error broadcasting message:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send broadcast')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Broadcast Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Message Type
              </label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as NotificationType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NotificationType.SYSTEM_MESSAGE}>
                    System Message
                  </SelectItem>
                  <SelectItem value={NotificationType.BROADCAST_MESSAGE}>
                    Broadcast Message
                  </SelectItem>
                  <SelectItem value={NotificationType.BROADCAST_ALERT}>
                    Broadcast Alert
                  </SelectItem>
                  <SelectItem value={NotificationType.BROADCAST_UPDATE}>
                    Broadcast Update
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your broadcast message..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Link (Optional)
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border outline-none rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Recipients
              </label>
              <UserSelector
                selectedUsers={selectedUsers}
                onUsersSelect={setSelectedUsers}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSending || !message.trim() || selectedUsers.length === 0}
          >
            {isSending ? 'Sending...' : 'Broadcast Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}