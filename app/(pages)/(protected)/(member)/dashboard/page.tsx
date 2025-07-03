import {
  History,
  Settings,
  BarChart3,
  ChevronRight,
  Bitcoin,
  Coins,
  DollarSign,
  Wallet,
  TrendingUp,
  Shield,
  HelpCircle,
  PieChart,
} from 'lucide-react'
import Link from 'next/link'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import type { Metadata } from 'next'
import { format } from 'date-fns'
import { Transaction } from '@/types/transaction-types'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { getStatusColor } from '@/lib/utils'
import { getTransactions, totalAmountOfTransactions } from '@/actions/transactions'

export const metadata: Metadata = {
  title: 'Dashboard | AMSA Fintech and IT solutions',
  description: 'Dashboard for AMSA Fintech and IT solutions',
  keywords: 'dashboard, AMSA Fintech and IT solutions',
}

const quickActions = [
  {
    name: 'Transactions',
    description: 'View your transaction history',
    icon: <History className="w-5 h-5" />,
    href: '/transactions',
  },
  {
    name: 'Analytics',
    description: 'View financial insights',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics',
  },
  {
    name: 'Assets',
    description: 'Browse available assets',
    icon: <Coins className="w-5 h-5" />,
    href: '/assets',
  },
  {
    name: 'Settings',
    description: 'Manage your account',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings',
  },
]

const popularAssets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: <Bitcoin className="w-5 h-5" />,
    href: '/assets/bitcoin?tab=overview',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: <Coins className="w-5 h-5" />,
    href: '/assets/ethereum?tab=overview',
  },
  {
    name: 'US Dollar',
    symbol: 'USD',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/assets/usd?tab=overview',
  },
]

const SimpleCryptoIcon = ({ currency }: { currency: string }) => (
  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 text-xs bg-white">
    {currency.slice(0, 4).toUpperCase()}
  </div>
)

const DashboardTransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isBuy = transaction.isBuyOrSell === 'BUY'
  const actionText = isBuy ? 'Buy' : 'Sell'

  return (
    <Link
      href={`/transaction/${transaction.id}`}
      className="flex items-center justify-between w-full border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-2 py-3 group rounded-md"
    >
      <div className="flex items-center gap-2 min-w-[40px]">
        <SimpleCryptoIcon currency={transaction.cryptoCurrency} />
      </div>
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
      <div className="flex flex-col items-end gap-1 min-w-[90px]">
        <span className="text-gray-800 text-sm">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: transaction.fiatCurrency || 'USD',
          }).format(Number(transaction.fiatAmount))}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${getStatusColor(transaction.status)}`}
          />
          {transaction.status}
        </div>
      </div>
      <div className="flex items-center ml-2">
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

const DashboardPage = async () => {
  const transactions = await getTransactions({ recent: true })
  const transactionArr = transactions.data as unknown as Transaction[]

  const txArrLen = transactionArr.length;

  const recentTransactions = transactionArr.slice(0, txArrLen>8?8:txArrLen)
  const totalCost = txArrLen>0?await totalAmountOfTransactions():0

  return (
    <AnimateWrapper>
      <div className="bg-gray-50/50 min-h-screen font-sans">
        <OffWhiteHeadingContainer>
          <div>
            <h1 className="text-5xl font-light">Dashboard</h1>
          </div>
        </OffWhiteHeadingContainer>

        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">24h Change</p>
                  <p className="text-lg font-semibold text-green-600">
                    +$1,234.56
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Assets</p>
                  <p className="text-lg font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-md border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900">
                    Quick Actions
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {quickActions.map((action) => (
                      <Link
                        key={action.name}
                        href={action.href}
                        className="group p-3 sm:p-3 rounded-lg transition-all duration-200 border border-gray-100 min-h-[70px] sm:min-h-0 flex items-center"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors flex-shrink-0">
                            <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                              {action.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-sm group-hover:text-blue-700 transition-colors">
                              {action.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                              {action.description}
                            </p>
                          </div>
                          <div className="hidden sm:block">
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
                          </div>
                          <div className="sm:hidden">
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md border border-gray-100">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900">
                    Recent Transactions
                  </h2>
                  {txArrLen > 0 && (
                    <Link
                      href="/transactions"
                      className="group inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View all
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
                <div className="p-4">
                  {txArrLen > 0 ? (
                    <div className="space-y-2">
                      {recentTransactions.map((transaction) => {
                        const transformedTransaction = {
                          ...transaction,
                          statusHistories:
                            transaction.statusHistories &&
                            typeof transaction.statusHistories === 'string'
                              ? (() => {
                                  try {
                                    return JSON.parse(transaction.statusHistories)
                                  } catch {
                                    return transaction.statusHistories
                                  }
                                })()
                              : transaction.statusHistories,
                        }
                        return (
                          <DashboardTransactionItem
                            key={transformedTransaction.id}
                            transaction={transformedTransaction as Transaction}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm mb-8">
                        No recent transactions.
                      </p>
                      <Link
                        href="/assets"
                        className="text-white transition-all bg-primary-main px-6 py-3 rounded-md mx-auto text-sm"
                      >
                        Buy your first asset
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-md border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900">
                    Popular Assets
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {popularAssets.map((asset) => (
                      <Link
                        key={asset.symbol}
                        href={asset.href}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            {asset.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {asset.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {asset.symbol}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href="/assets"
                      className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                    >
                      <span>All Assets</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900">
                    Settings & Support
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4" />
                        </div>
                        <span className="text-gray-900 text-sm">Profile</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/profile/security"
                      className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-gray-900 text-sm">Security</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/support"
                      className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <span className="text-gray-900 text-sm">Support</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardPage
