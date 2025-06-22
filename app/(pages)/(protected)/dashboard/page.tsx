import { getSession } from '@/lib/auth'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import {
  History,
  Settings,
  BarChart3,
  ChevronRight,
  Bitcoin,
  Coins,
  DollarSign,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  Shield,
  HelpCircle,
  FileText,
  PieChart,
  Clock,
  ArrowDownLeft,
} from 'lucide-react'
import Link from 'next/link'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { format } from 'date-fns'
import { Transaction } from '@/types/transaction-types'

export const metadata: Metadata = {
  title: 'Dashboard | AMSA Fintech and IT solutions',
  description: 'Dashboard for AMSA Fintech and IT solutions',
  keywords: 'dashboard, AMSA Fintech and IT solutions',
}

const popularAssets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$43,250.75',
    change: '+2.5%',
    icon: <Bitcoin className="w-6 h-6 text-orange-500" />,
    href: '/assets/bitcoin?tab=overview',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,250.30',
    change: '+1.8%',
    icon: <Coins className="w-6 h-6 text-blue-500" />,
    href: '/assets/ethereum?tab=overview',
  },
  {
    name: 'US Dollar',
    symbol: 'USD',
    price: '$1.00',
    change: '0.0%',
    icon: <DollarSign className="w-6 h-6 text-green-500" />,
    href: '/assets/usd?tab=overview',
  },
]

const quickActions = [
  {
    name: 'Transactions',
    description: 'View your transaction history',
    icon: <History className="w-6 h-6 text-orange-600" />,
    href: '/transactions',
    bgClass: 'bg-orange-50 dark:bg-orange-900/30',
  },
  {
    name: 'Analytics',
    description: 'View financial insights',
    icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
    href: '/analytics',
    bgClass: 'bg-purple-50 dark:bg-purple-900/30',
  },
  {
    name: 'Assets',
    description: 'Browse available assets',
    icon: <Coins className="w-6 h-6 text-blue-600" />,
    href: '/assets',
    bgClass: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    name: 'History',
    description: 'View past activities',
    icon: <Clock className="w-6 h-6 text-green-600" />,
    href: '/history',
    bgClass: 'bg-green-50 dark:bg-green-900/30',
  },
]

const settings = [
  {
    name: 'Profile',
    href: '/profile',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: 'Security',
    href: '/profile/security',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: 'Support',
    href: '/support',
    icon: <HelpCircle className="w-5 h-5" />,
  },
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

const DashboardTransactionItem = ({
  transaction,
}: {
  transaction: Transaction
}) => {
  const isBuy = transaction.isBuyOrSell === 'BUY'
  const actionText = isBuy ? 'Buy' : 'Sell'

  return (
    <Link
      href={`/transactions/${transaction.id}`}
      className="w-full bg-transparent p-4 rounded-xl border border-transparent transition-all duration-300 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
    >
      <div className="flex items-center space-x-4">
        <CryptoIcon currency={transaction.cryptoCurrency} isBuy={isBuy} />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-md">
            {actionText} {transaction.cryptoCurrency}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(transaction.createdAt, 'PP')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-gray-900 dark:text-white text-md">
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

const DashboardPage = async () => {
  const session = await getSession();

  const transactionArr = await prisma.transaction.findMany({
    where: {
      userId: session?.user?.id,
    },
  })

  const recentTransactions = transactionArr.slice(0, 3)

  const totalCost = transactionArr.reduce(
    (acc, item) => acc + item.fiatAmount,
    0
  )

  return (
    <AnimateWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <OffWhiteHeadingContainer>
          <div className="md:py-4">
            <div>
              <h1 className="text-4xl md:text-6xl tracking-wider font-light">Dashboard</h1>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">${totalCost}</p>
                </div>
              </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">+$1,234.56</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Assets</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">12</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="group p-4 hover:bg-gray-50 transition-colors border-gray-100 border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${action.bgClass} flex items-center justify-center`}>
                          {action.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{action.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h2>
                  </div>
                  <Link
                    href="/transactions"
                    className="group inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    View all
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="space-y-2 -m-4">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map(transaction => {
                      const transformedTransaction = {
                        ...transaction,
                        statusHistories:
                          transaction.statusHistories &&
                          typeof transaction.statusHistories === 'string'
                            ? JSON.parse(transaction.statusHistories)
                            : transaction.statusHistories,
                      }
                      return (
                        <DashboardTransactionItem
                          key={transformedTransaction.id}
                          transaction={transformedTransaction as Transaction}
                        />
                      )
                    })
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No recent transactions.</p>
                      <Link
                        href="/assets"
                        className="text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Make your first transaction
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white pt-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 px-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Popular Assets</h2>
                  </div>
                </div>
                <div className="">
                  {popularAssets.map((asset) => (
                    <Link
                      key={asset.symbol}
                      href={asset.href}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                          {asset.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-500">{asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{asset.price}</p>
                        <p className={`text-sm ${
                          asset.change.startsWith('+')
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}>
                          {asset.change}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100">
                  <Link
                    href="/assets"
                    className="flex w-full items-center justify-center gap-2 bg-primary-main px-6 py-4 text-sm font-semibold text-white"
                  >
                    <span>All Assets</span>
                    <ChevronRight className="h-4 w-4 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="bg-white pt-6 border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4 px-6">Settings & Support</h2>
                <div className="space-y-2">
                  {settings.map((setting) => (
                    <Link
                      key={setting.name}
                      href={setting.href}
                      className="flex items-center justify-between p-3 px-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          {setting.icon}
                        </div>
                        <span className="text-gray-900">{setting.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardPage
