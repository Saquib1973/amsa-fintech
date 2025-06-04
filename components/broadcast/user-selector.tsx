'use client'

import { useState, useEffect } from 'react'
import { Search, Users, User } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface User {
  id: string
  name: string | null
  email: string | null
  type: string
}

interface UserSelectorProps {
  onUsersSelect: (userIds: string[]) => void
  selectedUsers: string[]
}

export default function UserSelector({ onUsersSelect, selectedUsers }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        const data = await response.json()
        if (data.user) {
          setUsers(data.user)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (user.name?.toLowerCase().includes(searchLower) || false) ||
      (user.email?.toLowerCase().includes(searchLower) || false)
    )
  })

  const toggleUser = (userId: string) => {
    const newSelectedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId]
    onUsersSelect(newSelectedUsers)
  }

  const selectAllUsers = () => {
    onUsersSelect(users.map(user => user.id))
  }

  const clearSelection = () => {
    onUsersSelect([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <button
          onClick={selectAllUsers}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          All Users
        </button>
        <button
          onClick={clearSelection}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Clear
        </button>
      </div>

      <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
        {isLoading ? (
          <div className="divide-y">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-3 flex items-center gap-3 animate-pulse">
                <div className="h-4 w-4 rounded border-gray-200 bg-gray-200" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-gray-200" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="h-3 w-48 bg-gray-200 rounded mt-1" />
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No users found</div>
        ) : (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
              onClick={() => toggleUser(user.id)}
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => {}}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium truncate">
                    {user.name || 'Unnamed User'}
                  </p>
                </div>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {user.type}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="text-sm text-gray-500">
        {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  )
}