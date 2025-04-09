'use client'

import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import Loader from '@/components/loader-component'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import {
  Calendar,
  Download,
  Filter,
  Search
} from 'lucide-react'
import { useState } from 'react'

interface Order {
  id: string;
  status: string;
  createdAt: string;
  fiatAmount: number;
  cryptoAmount: number;
  cryptoCurrency: string;
  fiatCurrency: string;
  walletAddress: string;
  transactionHash: string;
  transactionLink: string;
  paymentOptionId: string;
}

export default function TransactionsPage() {
  const [dateRange, setDateRange] = useState('last30days')
  const [walletAddress, setWalletAddress] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    if (!walletAddress) return;

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/orders?walletAddress=${walletAddress}`)
      const data = await response.json()

      if (response.ok) {
        // The orders are in data.data array
        setOrders(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch orders')
      }
    } catch {
      setError('An error occurred while fetching orders')
    } finally {
      setLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
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

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-4 text-center h-[300px] text-gray-500">
            <Loader size="small" />
          </td>
        </tr>
      )
    }
    if (orders.length > 0) {
      return orders.map((order) => (
        <tr key={order.id} className="">
          <td className="px-6 py-4">
            <div className="font-medium text-gray-900">{order.id}</div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </td>
          <td className="px-6 py-4">
            {formatCurrency(order.fiatAmount, order.fiatCurrency)}
          </td>
          <td className="px-6 py-4">
            {order.cryptoAmount} {order.cryptoCurrency}
          </td>
          <td className="px-6 py-4">
            <span className="text-sm text-gray-500">
              {order.paymentOptionId.replace(/_/g, ' ').toUpperCase()}
            </span>
          </td>
          <td className="px-6 py-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.status === 'COMPLETED'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </td>
          <td className="px-6 py-4">
            {order.transactionLink ? (
              <a
                href={order.transactionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                View
              </a>
            ) : (
              <span className="text-gray-500 text-sm">-</span>
            )}
          </td>
        </tr>
      ))
    }
    return (
      <tr>
        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
          {walletAddress ? 'No orders found' : 'Enter a wallet address to search'}
        </td>
      </tr>
    )
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
          {/* Wallet Address Input */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter wallet address..."
                    className="w-full p-3 pl-10 border dark:placeholder:text-gray-600 border-gray-300 dark:border-gray-800 rounded-md"
                  />
                  <Search className="w-5 h-5 text-gray-400 dark:text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              <button
                onClick={fetchOrders}
                disabled={!walletAddress || loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>

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
                  <option value="last30days">Last 30 Days</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="today">Today</option>
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

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Fiat Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Crypto Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Payment Method</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {renderTableContent()}
                </tbody>
              </table>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}