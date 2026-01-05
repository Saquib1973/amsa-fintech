'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  ChevronRight
} from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { format } from 'date-fns'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

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
  status: string
  createdAt: string
}

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  isVerified: boolean
  type: string
  createdAt: string
  totalSpent: number
  totalReceived: number
  transactions: Transaction[]
  _count: {
    transactions: number
  }
}

interface Analytics {
  monthlyData: { [key: string]: { buy: number; sell: number } }
  cryptoData: { [key: string]: number }
}

export default function UserDetailClient() {
  const params = useParams()
  const userId = params?.id as string

  const [user, setUser] = useState<UserData | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/users/${userId}`)
        if (!res.ok) throw new Error('Failed to fetch user details')
        const data = await res.json()
        setUser(data.user)
        setAnalytics(data.analytics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold">Error loading user details</p>
        <p className="text-red-500 text-sm mt-2">{error || 'User not found'}</p>
      </div>
    )
  }

  // Prepare chart data
  const monthlyLabels = Object.keys(analytics?.monthlyData || {})
  const monthlyBuyData = monthlyLabels.map(month => analytics?.monthlyData[month]?.buy || 0)
  const monthlySellData = monthlyLabels.map(month => analytics?.monthlyData[month]?.sell || 0)

  const cryptoLabels = Object.keys(analytics?.cryptoData || {}).slice(0, 10)
  const cryptoValues = cryptoLabels.map(crypto => analytics?.cryptoData[crypto] || 0)

  const barChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Buy',
        data: monthlyBuyData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Sell',
        data: monthlySellData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  }

  const doughnutChartData = {
    labels: cryptoLabels,
    datasets: [
      {
        data: cryptoValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(100, 116, 139, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || user.email}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-700 text-2xl bg-gradient-to-br from-blue-50 to-indigo-50 font-semibold">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-light text-gray-900">
                  {user.name || 'No Name'}
                </h2>
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                  user.type === 'SUPER_ADMIN' 
                    ? 'bg-purple-100 text-purple-700'
                    : user.type === 'ADMIN'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.type}
                </span>
                {user.isVerified ? (
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Unverified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(user.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Transactions</p>
                    <p className="text-sm text-gray-900">{user._count.transactions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs text-gray-500">Total Volume</p>
            </div>
            <p className="text-2xl font-light text-gray-900 ml-10">
              ${(user.totalSpent + user.totalReceived).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
            <p className="text-2xl font-light text-emerald-600 ml-10">
              ${user.totalSpent.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-xs text-gray-500">Total Received</p>
            </div>
            <p className="text-2xl font-light text-rose-600 ml-10">
              ${user.totalReceived.toFixed(2)}
            </p>
          </div>
        </div>

      {/* Charts */}
      {(monthlyLabels.length > 0 || cryptoLabels.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {monthlyLabels.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-lg font-light text-gray-900 mb-4">Monthly Activity</h3>
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}

          {cryptoLabels.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-lg font-light text-gray-900 mb-4">Crypto Distribution</h3>
              <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      {user.transactions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-light text-gray-900">Recent Transactions</h3>
            <Link
              href={`/user/${userId}/transactions`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-2">
          {user.transactions.slice(0, 10).map((tx) => (
            <Link
              key={tx.id}
              href={`/transaction/${tx.id}`}
              className="flex items-center justify-between w-full border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-2 py-3 group rounded-md"
            >
              <div className="flex items-center gap-2 min-w-[40px]">
                <SimpleCryptoIcon currency={tx.cryptoCurrency} />
              </div>
              
              <div className="flex-1 min-w-0 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 text-sm group-hover:underline group-hover:text-blue-600 transition-colors">
                    {tx.isBuyOrSell} {tx.cryptoCurrency}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {formatDate(tx.createdAt, 'MMM d, yyyy')}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 min-w-[90px]">
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
      )}
    </div>
  )
}
