"use client"
import type { User } from '@/types/user'
import { CheckCircle, ChevronRight, Mail, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchButton from './search-button'

interface EnhancedUser extends User {
  _count?: {
    transactions: number
  }
  totalSpent?: number
  totalReceived?: number
}

const UserItem = ({ user }: { user: EnhancedUser }) => (
  <Link
    href={`/user/${user.id}`}
    className="contents group"
  >
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 group-hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || user.email || 'User'}
            width={40}
            height={40}
            className="rounded-full border border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-sm bg-gradient-to-br from-blue-50 to-indigo-50 font-semibold flex-shrink-0">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email?.charAt(0).toUpperCase() || '?'}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-gray-900 font-medium text-sm truncate">
              {user.name || 'No Name'}
            </span>
            {user.isVerified ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="px-4 py-3 border-b border-gray-100 group-hover:bg-gray-50 transition-colors text-center">
      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${user.type === 'SUPER_ADMIN'
          ? 'bg-purple-100 text-purple-700'
          : user.type === 'ADMIN'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
        {user.type}
      </span>
    </div>

    <div className="px-4 py-3 border-b border-gray-100 group-hover:bg-gray-50 transition-colors text-center">
      <span className="text-sm text-gray-900 font-medium">{user._count?.transactions || 0}</span>
    </div>

    <div className="px-4 py-3 border-b border-gray-100 group-hover:bg-gray-50 transition-colors text-right">
      <span className="text-sm text-gray-900 font-medium">${user.totalSpent?.toFixed(2) || '0.00'}</span>
    </div>

    <div className="px-4 py-3 border-b border-gray-100 group-hover:bg-gray-50 transition-colors text-right">
      <span className="text-sm text-gray-900 font-medium">${user.totalReceived?.toFixed(2) || '0.00'}</span>
    </div>

    <div className="px-4 py-3 border-b border-gray-100 group-hover:bg-gray-50 transition-colors text-center">
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors mx-auto" />
    </div>
  </Link>
)

const UserItemSkeleton = () => (
  <>
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
      </div>
    </div>
    <div className="px-4 py-3 border-b border-gray-100"><div className="h-5 bg-gray-200 rounded w-16 mx-auto animate-pulse" /></div>
    <div className="px-4 py-3 border-b border-gray-100"><div className="h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse" /></div>
    <div className="px-4 py-3 border-b border-gray-100"><div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse" /></div>
    <div className="px-4 py-3 border-b border-gray-100"><div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse" /></div>
    <div className="px-4 py-3 border-b border-gray-100"><div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse" /></div>
    <div className="px-4 py-3 border-b border-gray-100"><div className="h-4 bg-gray-200 rounded w-4 mx-auto animate-pulse" /></div>
  </>
)

const UsersListClient = () => {
  const [users, setUsers] = useState<EnhancedUser[]>([])
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
      {!loading && users.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <p className="text-lg font-semibold text-gray-600">No users found</p>
        </div>
      )}
      {(loading || users.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_100px_120px_120px_100px_60px] bg-gray-50 border-b border-gray-200">
            <div className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User</div>
            <div className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Role</div>
            <div className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Trans.</div>
            <div className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Spent</div>
            <div className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Received</div>
            <div className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Joined</div>
            <div className="px-4 py-3"></div>
          </div>

          {/* Table Body */}
          {loading && (
            <div className="grid grid-cols-[1fr_120px_100px_120px_120px_100px_60px]">
              {[...Array(5)].map((_, i) => (
                <UserItemSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && users.length > 0 && (
            <>
              <div className="mb-4 px-4 py-2 text-sm text-gray-500 bg-gray-50 border-b border-gray-100">
                Showing {(page - 1) * rows + 1} - {Math.min(page * rows, total)} of {total} users
              </div>
              <div className="grid grid-cols-[1fr_120px_100px_120px_120px_100px_60px]">
                {users.map((user) => (
                  <UserItem key={user.id} user={user} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {page > 3 && (
              <>
                <button onClick={() => setPage(1)} className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors">
                  1
                </button>
                {page > 4 && <span className="text-gray-400">...</span>}
              </>
            )}

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1
              if (pageNum < page - 2 || pageNum > page + 2) return null
              return (
                <button
                  key={index}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${page === pageNum
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              )
            })}

            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && <span className="text-gray-400">...</span>}
                <button onClick={() => setPage(totalPages)} className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors">
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default UsersListClient