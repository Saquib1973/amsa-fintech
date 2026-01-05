'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'

const SimpleCryptoIcon = ({ currency }: { currency: string }) => (
  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-xs bg-white">
    {currency.slice(0, 3).toUpperCase()}
  </div>
)

const formatDate = (dateString: string, formatStr: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    return format(date, formatStr)
  } catch {
    return 'Invalid date'
  }
}

interface Transaction {
  id: string
  isBuyOrSell: string
  fiatAmount: number
  fiatCurrency: string
  cryptoCurrency: string
  cryptoAmount: number | null
  walletAddress: string
  network: string
  status: string
  createdAt: string
  updatedAt: string
}

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
}

export default function UserTransactionsClient() {
  const params = useParams()
  const userId = params?.id as string

  const [user, setUser] = useState<UserData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const rows = 20

  useEffect(() => {
    if (!userId) return

    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/users/${userId}/transactions?page=${page}&rows=${rows}`)
        if (!res.ok) throw new Error('Failed to fetch transactions')
        const data = await res.json()
        setUser(data.user)
        setTransactions(data.transactions)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId, page])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold">Error loading transactions</p>
        <p className="text-red-500 text-sm mt-2">{error || 'User not found'}</p>
      </div>
    )
  }

  // Group transactions by date
  const groupedTransactions: { [key: string]: Transaction[] } = {}
  transactions.forEach((tx) => {
    try {
      const date = new Date(tx.createdAt)
      if (isNaN(date.getTime())) return
      
      let groupKey: string
      if (isToday(date)) {
        groupKey = 'Today'
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday'
      } else {
        groupKey = format(date, 'MMMM yyyy')
      }
      if (!groupedTransactions[groupKey]) {
        groupedTransactions[groupKey] = []
      }
      groupedTransactions[groupKey].push(tx)
    } catch {
      // Skip invalid dates
    }
  })

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <h2 className="text-xl font-light text-gray-900 mb-1">
          All Transactions for {user.name || user.email}
        </h2>
        <p className="text-sm text-gray-500">
          Total: {total} transaction{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Transactions */}
      {transactions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <p className="text-gray-400 text-sm">No transactions found</p>
        </div>
      ) : (
        <>
          {Object.entries(groupedTransactions).map(([dateGroup, txs]) => (
            <div key={dateGroup} className="bg-white rounded-lg border border-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">{dateGroup}</h3>
              <div className="space-y-2">
                {txs.map((tx) => (
                  <Link
                    key={tx.id}
                    href={`/transaction/${tx.id}`}
                    className="flex items-center justify-between w-full border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-2 py-3 group rounded-md"
                  >
                    <div className="flex items-center gap-2 min-w-[40px]">
                      <SimpleCryptoIcon currency={tx.cryptoCurrency} />
                    </div>
                    
                    <div className="flex-1 min-w-0 px-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-800 text-sm group-hover:underline group-hover:text-blue-600 transition-colors">
                          {tx.isBuyOrSell} {tx.cryptoCurrency}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-md ${
                          tx.isBuyOrSell === 'BUY' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {tx.isBuyOrSell}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {tx.network} • {formatDate(tx.createdAt, 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 min-w-[120px]">
                      {tx.cryptoAmount && (
                        <span className="text-xs text-gray-500">
                          {tx.cryptoAmount.toFixed(6)} {tx.cryptoCurrency}
                        </span>
                      )}
                      <span className="text-gray-800 text-sm">
                        ${tx.fiatAmount.toFixed(2)} {tx.fiatCurrency}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${
                        tx.status === 'COMPLETED' 
                          ? 'bg-green-50 text-green-700' 
                          : tx.status === 'PENDING'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="flex items-center ml-2">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
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
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      page === pageNum
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
          
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {(page - 1) * rows + 1} - {Math.min(page * rows, total)} of {total} transactions
          </div>
        </div>
      )}
    </div>
  )
}
