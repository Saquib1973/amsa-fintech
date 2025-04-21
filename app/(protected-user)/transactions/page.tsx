'use client'

import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import Loader from '@/components/loader-component'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import {
  Calendar,
  Download,
  Search
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Wallet {
  id: string;
  address: string;
  type: string;
}

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
  const { data: session } = useSession()
  const [dateRange, setDateRange] = useState('last30days')
  const [walletAddress, setWalletAddress] = useState('')
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [walletsLoading, setWalletsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWallets = async () => {
      if (!session?.user?.id) return;

      setWalletsLoading(true)
      try {
        const response = await fetch('/api/wallet')
        const data = await response.json()

        if (response.ok) {
          const walletsData = data.wallets || []
          setWallets(walletsData)
          if (walletsData.length > 0) {
            setWalletAddress(walletsData[0].address)
          }
        } else {
          setError(data.error || 'Failed to fetch wallets')
        }
      } catch {
        setError('An error occurred while fetching wallets')
      } finally {
        setWalletsLoading(false)
      }
    }

    fetchWallets()
  }, [session?.user?.id])

  useEffect(() => {
    if (walletAddress) {
      fetchOrders()
    }
  }, [walletAddress])

  const fetchOrders = async () => {
    if (!walletAddress) return;

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/orders?walletAddress=${walletAddress}`)
      const data = await response.json()

      if (response.ok) {
        const ordersData = Array.isArray(data.data) ? data.data : []
        setOrders(ordersData)
      } else {
        setError(data.error || 'Failed to fetch orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('An error occurred while fetching orders')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

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
            <Loader size="sm" />
          </td>
        </tr>
      )
    }
    if (orders.length > 0) {
      return orders.map((order) => {
        if (!order || typeof order !== 'object') {
          console.error('Invalid order data:', order)
          return null
        }
        return (
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
                {order.paymentOptionId?.replace(/_/g, ' ').toUpperCase()}
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
        )
      })
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
          <div className="py-4 flex items-center gap-2 justify-end">
            <div className="relative max-w-md">
              <select
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="input-field w-[300px]"
              >
                {walletsLoading && (
                  <option value="">Loading...</option>
                )}
                {!walletsLoading && wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.address}>
                    {wallet.type === 'web3' ? 'Web3' : 'Fiat'} - {wallet.address?.slice(0, 10)}...{wallet.address?.slice(-4)}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          {error && <p className="mb-4 text-red-500">{error}</p>}

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