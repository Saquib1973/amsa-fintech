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
} from 'lucide-react'
import Link from 'next/link'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import { prisma } from '@/lib/prisma'

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
          <div className="py-8">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
                Welcome back,{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  {session?.user?.email ? session.user.email.split('@')[0] : ''}
                </span>
              </h1>
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
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center`}>
                          {transaction.isBuyOrSell === 'BUY' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                           transaction.isBuyOrSell === 'SELL' ? <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" /> :
                           <ArrowUpRight className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.isBuyOrSell} {transaction.cryptoCurrency}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.fiatAmount}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.fiatAmount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
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
