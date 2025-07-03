"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import type { User } from '@/types/user'
import SearchButton from './search-button'
import Link from 'next/link'

const UserItem = ({ user }: { user: User }) => (
  <Link href={`/user/${user.id}`} className="flex items-center justify-between w-full border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-2 py-3 group rounded-md">
    <div className="flex items-center gap-3 min-w-[40px]">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name || user.email || 'User'}
          width={40}
          height={40}
          className="rounded-full border border-gray-200"
        />
      ) : (
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-xs bg-white">
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : user.email?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0 px-2">
      <div className="flex items-center gap-2">
        <span className="text-gray-800 text-sm group-hover:underline group-hover:text-blue-600 transition-colors duration-100">
          {user.name || 'No Name'}
        </span>
        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-400">
          {user.type}
        </span>
        {user.isVerified && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-100 text-green-600">
            Verified
          </span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
    </div>
  </Link>
)

const UserItemSkeleton = () => (
  <div className="flex items-center justify-between w-full border-b border-gray-100 px-2 py-3 group rounded-md">
    <div className="flex items-center gap-3 min-w-[40px]">
      <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-100 animate-pulse" />
    </div>
    <div className="flex-1 min-w-0 px-2">
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
        <div className="ml-2 h-3 bg-gray-100 rounded w-10 animate-pulse" />
        <div className="ml-2 h-3 bg-green-100 rounded w-12 animate-pulse" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-16 mt-0.5 animate-pulse" />
    </div>
  </div>
)

const UsersListClient = () => {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const rows = 10

  const fetchUsers = async (pageNum = 1, searchQuery = '') => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        rows: String(rows),
      })
      if (searchQuery) params.append('q', searchQuery)
      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data.users)
      setTotal(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(page, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search])

  const handleSearch = (q: string) => {
    setPage(1)
    setSearch(q)
  }

  const totalPages = Math.ceil(total / rows)

  return (
    <>
      <SearchButton onSearch={handleSearch} />
      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200 mb-6">
          <p className="text-red-600 font-semibold mt-2">Error loading users</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      {loading && (
        <div className="space-y-3 mb-6">
          {[...Array(5)].map((_, i) => (
            <UserItemSkeleton key={i} />
          ))}
        </div>
      )}
      {!loading && users.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-gray-600">No users found</p>
        </div>
      )}
      {!loading && users.length > 0 && (
        <div className="mb-6">
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`w-10 h-10 rounded-md flex cursor-pointer items-center justify-center text-sm transition-colors ${
                page === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default UsersListClient