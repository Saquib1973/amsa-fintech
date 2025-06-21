'use client'

import React, { useState, useEffect } from 'react'
import { History, Check, Globe, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import LoginHistoryLoader from '@/components/loader-skeletons/login-history-loader'

interface LoginSession {
  id: string
  location: string
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
        const data = (await response.json()) as ApiResponse

        console.log("session data",data)

        const transformedSessions: LoginSession[] = data.sessions.map(
          (session: ApiSession) => ({
            id: session.id,
            location: session.location || 'Unknown Location',
            timestamp: session.expires,
            current: session.current,
          })
        )

        setSessions(transformedSessions)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const renderLoginHistory = () => {
    if (isLoading) {
      return <LoginHistoryLoader />
    } else if (sessions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Login History</h3>
          <p className="text-gray-500 max-w-sm">
            Your login history will appear here once you start using the application.
          </p>
        </div>
      )
    } else {
      return (
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <div key={session.id} className="py-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    session.current ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <Globe className={`w-5 h-5 ${
                      session.current ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {session.location}
                    </h4>
                    {session.current && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                        <Check className="w-3 h-3 mr-1" />
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {formatDistanceToNow(new Date(session.timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Login History</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your active login sessions across different devices and locations.
          </p>
        </div>
        <div className="px-6 py-5">
          {renderLoginHistory()}
        </div>
    </div>
  )
}
