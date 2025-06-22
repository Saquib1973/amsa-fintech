'use client'

import React, { useEffect, useState, useMemo } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
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
import { motion } from 'framer-motion'

type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'

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

const getStatusChip = (status: Transaction['status']) => {
  const baseClasses = 'px-2.5 py-1 text-xs font-medium rounded-full inline-block'
  switch (status) {
    case 'COMPLETED':
      return (
        <span className={`${baseClasses} text-green-800 bg-green-100`}>
          Completed
        </span>
      )
    case 'PENDING':
      return (
        <span className={`${baseClasses} text-yellow-800 bg-yellow-100`}>
          Pending
        </span>
      )
    case 'PROCESSING':
      return (
        <span className={`${baseClasses} text-blue-800 bg-blue-100`}>
          Processing
        </span>
      )
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
      return (
        <span className={`${baseClasses} text-red-800 bg-red-100`}>
          {status}
        </span>
      )
    default:
      return (
        <span className={`${baseClasses} text-gray-800 bg-gray-100`}>
          {status}
        </span>
      )
  }
}

const CryptoIcon = ({
  currency,
  isBuy,
}: {
  currency: string
  isBuy: boolean
}) => {
  const colors = [
    'bg-orange-100 text-orange-600',
    'bg-blue-100 text-blue-600',
    'bg-indigo-100 text-indigo-600',
    'bg-purple-100 text-purple-600',
    'bg-pink-100 text-pink-600',
    'bg-teal-100 text-teal-600',
    'bg-red-100 text-red-600',
  ]
  const color = colors[currency.charCodeAt(0) % colors.length]
  const Icon = isBuy ? ArrowUpRight : ArrowDownLeft
  const iconColor = isBuy
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700'

  return (
    <div className="relative">
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-md ${color}`}
      >
        {currency.slice(0, 3).toUpperCase()}
      </div>
      <div
        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${iconColor}`}
      >
        <Icon className="w-3 h-3" />
      </div>
    </div>
  )
}

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isBuy = transaction.isBuyOrSell === 'BUY'
  const actionText = isBuy ? 'Buy' : 'Sell'

  return (
    <Link
      href={`/transactions/${transaction.id}`}
      className="w-full bg-white p-4 rounded-xl border border-gray-200/60 transition-all duration-300 flex items-center justify-between cursor-pointer hover:border-gray-300 hover:shadow-sm group"
    >
      <div className="flex items-center space-x-4">
        <CryptoIcon currency={transaction.cryptoCurrency} isBuy={isBuy} />
        <div>
          <p className="font-semibold text-gray-900 text-md">
            {actionText} {transaction.cryptoCurrency}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(transaction.createdAt), 'PP')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-gray-900 text-md">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: transaction.fiatCurrency,
            }).format(transaction.fiatAmount)}
          </p>
          <div className="mt-1 flex justify-end">
            {getStatusChip(transaction.status)}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
      </div>
    </Link>
  )
}

const TransactionItemSkeleton = () => {
  return (
    <div className="w-full bg-white p-4 rounded-xl border border-gray-200/60 flex items-center justify-between animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-11 h-11 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded-full w-28"></div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
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
              className="pl-10 pr-4 py-2 w-full sm:w-48 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
            />
          </div>
          <Select
            onValueChange={value => setActiveStatusFilter(value)}
            defaultValue="All"
          >
            <SelectTrigger className="w-[150px]">
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
                <div className="space-y-2">
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
          </div>
        )}
    </>
  )
}

const TransactionsPage = () => {
  return (
    <div className="bg-gray-50/50 min-h-screen font-sans">
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