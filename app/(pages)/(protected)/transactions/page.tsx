'use client'

import React, { useEffect, useState, useMemo } from 'react'
import {
  Search,
  X,
  ChevronRight,
} from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import { AnimatePresence, motion } from 'framer-motion'
import type { TransactionStatus } from '@/types/transaction-types'
import { getStatusColor } from '@/lib/utils'



type Transaction = {
  id: string
  isBuyOrSell: 'BUY' | 'SELL'
  cryptoCurrency: string
  network: string
  fiatAmount: number
  fiatCurrency: string
  status: TransactionStatus
  createdAt: string // API returns date as string
  walletAddress: string
}

const statusFilters: ('All' | TransactionStatus)[] = [
  'All',
  'COMPLETED',
  'PENDING',
  'FAILED',
  'PROCESSING',
  'CANCELLED',
  'EXPIRED',
]

const SimpleCryptoIcon = ({ currency }: { currency: string }) => (
  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-xs bg-white">
    {currency.slice(0, 3).toUpperCase()}
  </div>
)

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isBuy = transaction.isBuyOrSell === 'BUY'
  const actionText = isBuy ? 'Buy' : 'Sell'

  return (
    <Link
      href={`/transactions/${transaction.id}`}
      className="flex items-center justify-between w-full border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-2 py-3 group rounded-md"
      aria-label={`View details for ${actionText} ${transaction.cryptoCurrency} transaction`}
    >
      {/* Left: Crypto icon */}
      <div className="flex items-center gap-2 min-w-[40px]">
        <SimpleCryptoIcon currency={transaction.cryptoCurrency} />
      </div>
      {/* Center: Info */}
      <div className="flex-1 min-w-0 px-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-800 text-sm group-hover:underline group-hover:text-blue-600 transition-colors duration-100">
            {actionText} {transaction.cryptoCurrency}
          </span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-400">
            {transaction.network}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {format(new Date(transaction.createdAt), 'PP')}
        </div>
      </div>
      {/* Right: Amount, status, chevron */}
      <div className="flex flex-col items-end gap-1 min-w-[90px]">
        <span className="text-gray-800 text-sm">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: transaction.fiatCurrency,
          }).format(transaction.fiatAmount)}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${getStatusColor(transaction.status)}`}
          />
          {transaction.status}
        </div>
      </div>
      <div className="flex items-center ml-2" title="View transaction details">
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

const TransactionItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full border-b border-gray-100 px-2 py-3">
      {/* Left: Icon */}
      <div className="flex items-center gap-2 min-w-[40px]">
        <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-100" />
      </div>
      {/* Center: Info */}
      <div className="flex-1 min-w-0 px-2">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-100 rounded w-20 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-10" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-16 mt-1" />
      </div>
      {/* Right: Amount, status, chevron */}
      <div className="flex flex-col items-end gap-1 min-w-[90px]">
        <div className="h-4 bg-gray-100 rounded w-14 mb-1" />
        <div className="h-3 bg-gray-100 rounded w-10" />
      </div>
      <div className="flex items-center ml-2">
        <div className="w-4 h-4 bg-gray-100 rounded" />
      </div>
    </div>
  )
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All')

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch('/api/transaction')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const data = await response.json()
        setTransactions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (activeStatusFilter !== 'All' && tx.status !== activeStatusFilter) {
        return false
      }
      const searchLower = searchTerm.toLowerCase()
      if (
        searchLower &&
        !tx.cryptoCurrency.toLowerCase().includes(searchLower) &&
        !tx.network.toLowerCase().includes(searchLower)
      ) {
        return false
      }
      return true
    })
  }, [transactions, searchTerm, activeStatusFilter])

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, tx) => {
        const date = new Date(tx.createdAt)
        let groupKey = format(date, 'MMMM yyyy')
        if (isToday(date)) {
          groupKey = 'Today'
        } else if (isYesterday(date)) {
          groupKey = 'Yesterday'
        }

        if (!acc[groupKey]) {
          acc[groupKey] = []
        }
        acc[groupKey].push(tx)
        return acc
      },
      {} as Record<string, Transaction[]>,
    )
  }, [filteredTransactions])

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => {
      const aDate = a === 'Today' ? new Date() : a === 'Yesterday' ? new Date(new Date().setDate(new Date().getDate() -1)) : new Date(a);
      const bDate = b === 'Today' ? new Date() : b === 'Yesterday' ? new Date(new Date().setDate(new Date().getDate() -1)) : new Date(b);
      return bDate.getTime() - aDate.getTime();
    });
  }, [groupedTransactions]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-end items-center mb-8 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-48 border border-gray-300 rounded-md transition-colors"
            />
          </div>
          <Select
            onValueChange={value => setActiveStatusFilter(value)}
            defaultValue="All"
            >
            <SelectTrigger className="w-[150px] outline-none">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <TransactionItemSkeleton key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <X className="w-8 h-8 mx-auto text-red-500" />
          <p className="text-red-600 font-semibold mt-2">
            Error loading transactions
          </p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && filteredTransactions.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-gray-600">
            No transactions found
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        filteredTransactions.length > 0 && (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {sortedGroupKeys.map((dateKey,index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 ,delay: 0.1 * (index + 1)%10 }}
                key={dateKey}>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1 tracking-wider uppercase">
                  {dateKey}
                </h3>
                <div className="">
                  {groupedTransactions[dateKey].map((tx,txIndex) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 ,delay: 0.1 * (txIndex + 1)%10 }}
                      key={tx.id}>
                      <TransactionItem transaction={tx} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        )}
    </>
  )
}

const TransactionsPage = () => {
  return (
    <div className="bg-gray-50/50 min-h-[calc(100vh-69px)] font-sans">
      <OffWhiteHeadingContainer>
        <div>
          <h1 className="text-5xl font-light">Transactions</h1>
        </div>
      </OffWhiteHeadingContainer>
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <TransactionHistory />
      </main>
    </div>
  )
}

export default TransactionsPage