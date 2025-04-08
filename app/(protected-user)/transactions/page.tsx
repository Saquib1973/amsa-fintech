'use client'

import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Download,
  Filter,
  Search
} from 'lucide-react'
import { useState } from 'react'

export default function TransactionsPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [dateRange, setDateRange] = useState('last30days')

  // Sample transaction data
  const transactions = [
    {
      id: 'TRX001',
      type: 'credit',
      amount: 1500.00,
      description: 'Salary Deposit',
      date: '2024-03-15T10:30:00',
      status: 'completed',
      category: 'Income',
      account: 'Main Account'
    },
    {
      id: 'TRX002',
      type: 'debit',
      amount: 299.99,
      description: 'Online Shopping',
      date: '2024-03-14T15:45:00',
      status: 'completed',
      category: 'Shopping',
      account: 'Main Account'
    },
    {
      id: 'TRX003',
      type: 'debit',
      amount: 50.00,
      description: 'Restaurant Payment',
      date: '2024-03-13T19:20:00',
      status: 'completed',
      category: 'Food & Dining',
      account: 'Main Account'
    },
    {
      id: 'TRX004',
      type: 'credit',
      amount: 200.00,
      description: 'Refund',
      date: '2024-03-12T11:15:00',
      status: 'completed',
      category: 'Refund',
      account: 'Main Account'
    },
    {
      id: 'TRX005',
      type: 'debit',
      amount: 75.00,
      description: 'Utility Bill',
      date: '2024-03-11T09:00:00',
      status: 'pending',
      category: 'Bills',
      account: 'Main Account'
    }
  ]

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Transactions' },
    { id: 'credit', label: 'Credits' },
    { id: 'debit', label: 'Debits' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' }
  ]

  // Date range options
  const dateRangeOptions = [
    { id: 'today', label: 'Today' },
    { id: 'last7days', label: 'Last 7 Days' },
    { id: 'last30days', label: 'Last 30 Days' },
    { id: 'last90days', label: 'Last 90 Days' },
    { id: 'custom', label: 'Custom Range' }
  ]

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AnimateWrapper>
      <div className="min-h-screen text-black dark:text-white">
        <OffWhiteHeadingContainer>
          <div className="flex w-full max-md:flex-col justify-center items-center">
            <div>
              <h1 className="text-4xl font-light">Transactions</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-2 font-light">
                View and manage your transactions
              </p>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="py-6 md:py-16">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full p-3 pl-10 border dark:placeholder:text-gray-600 border-gray-300 dark:border-gray-800 rounded-md"
                />
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none p-3 pr-10 border border-gray-300 dark:border-gray-800 rounded-md bg-white dark:bg-gray-950"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md text-sm">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md text-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  if (activeFilters.includes(filter.id)) {
                    setActiveFilters(activeFilters.filter((f) => f !== filter.id))
                  } else {
                    setActiveFilters([...activeFilters, filter.id])
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeFilters.includes(filter.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 text-gray-400 dark:text-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Transaction</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Account</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <ArrowUpRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{transaction.description}</div>
                            <div className="text-sm text-gray-500">ID: {transaction.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{transaction.account}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to 5 of 5 transactions
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400">
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400">
                Next
              </button>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}