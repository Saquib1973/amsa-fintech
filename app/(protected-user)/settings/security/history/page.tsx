"use client"

import React, { useState, useEffect } from 'react'
import { History, Check, Globe } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface LoginSession {
  id: string
  location: string
  device: string
  ip: string
  timestamp: string
  current: boolean
}

interface ApiSession {
  id: string
  sessionToken: string
  userId: string
  expires: string
  location: string | null
  current: boolean
}

interface ApiResponse {
  sessions: ApiSession[]
}

export default function LoginHistoryPage() {
  const [sessions, setSessions] = useState<LoginSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/auth/manage-session')
        if (!response.ok) {
          throw new Error('Failed to fetch sessions')
        }
        const data = await response.json() as ApiResponse

        // Transform the sessions data to match our interface
        const transformedSessions: LoginSession[] = data.sessions.map((session: ApiSession) => ({
          id: session.id,
          location: session.location || 'Unknown Location',
          device: 'Unknown Device', // This information is not stored in the database
          ip: 'Unknown IP', // This information is not stored in the database
          timestamp: session.expires,
          current: session.current
        }))

        setSessions(transformedSessions)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/auth/manage-session?id=${sessionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to revoke session')
      }

      // Remove the revoked session from the state
      setSessions(sessions.filter(session => session.id !== sessionId))
    } catch (error) {
      console.error('Error revoking session:', error)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium">Login History</h3>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No login history found</div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-gray-50 rounded-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{session.location}</h4>
                      {session.current && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                          <Check className="w-3 h-3 mr-1" />
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{session.device}</p>
                    <p className="text-sm text-gray-500">IP: {session.ip}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(session.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}