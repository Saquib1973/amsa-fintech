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
  Bell,
  Shield,
  HelpCircle,
  FileText,
  Users,
  PieChart,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'

const popularAssets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$43,250.75',
    change: '+2.5%',
    icon: <Bitcoin className="w-6 h-6 text-orange-500" />,
    href: '/assets/bitcoin',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,250.30',
    change: '+1.8%',
    icon: <Coins className="w-6 h-6 text-blue-500" />,
    href: '/assets/ethereum',
  },
  {
    name: 'US Dollar',
    symbol: 'USD',
    price: '$1.00',
    change: '0.0%',
    icon: <DollarSign className="w-6 h-6 text-green-500" />,
    href: '/assets/usd',
  },
]

const quickActions = [
  {
    name: 'Transactions',
    description: 'View your transaction history',
    icon: <History className="w-6 h-6 text-orange-600" />,
    href: '/transactions',
    color: 'orange',
  },
  {
    name: 'Analytics',
    description: 'View financial insights',
    icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
    href: '/analytics',
    color: 'purple',
  },
  {
    name: 'Assets',
    description: 'Browse available assets',
    icon: <Coins className="w-6 h-6 text-blue-600" />,
    href: '/assets',
    color: 'blue',
  },
  {
    name: 'History',
    description: 'View past activities',
    icon: <Clock className="w-6 h-6 text-green-600" />,
    href: '/history',
    color: 'green',
  },
]

const recentTransactions = [
  {
    id: 1,
    type: 'Buy',
    asset: 'Bitcoin',
    amount: '0.5 BTC',
    value: '$21,625.38',
    date: '2 hours ago',
    status: 'completed',
  },
  {
    id: 2,
    type: 'Sell',
    asset: 'Ethereum',
    amount: '2 ETH',
    value: '$4,500.60',
    date: '5 hours ago',
    status: 'completed',
  },
  {
    id: 3,
    type: 'Transfer',
    asset: 'USD',
    amount: '$1,000',
    value: '$1,000.00',
    date: '1 day ago',
    status: 'pending',
  },
]

const settings = [
  {
    name: 'Profile Settings',
    href: '/profile',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: 'Security',
    href: '/profile/security',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    name: 'Notifications',
    href: '/profile/notifications',
    icon: <Bell className="w-5 h-5" />,
  },
  {
    name: 'Help Center',
    href: '/help',
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: 'Team',
    href: '/team',
    icon: <Users className="w-5 h-5" />,
  },
]

const DashboardPage = async () => {
  const session = await getSession()

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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">$45,375.68</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Demo Data</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-green-600 dark:text-green-400">+2.5% from last month</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">+$1,234.56</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Demo Data</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Across all assets</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Assets</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">12</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Demo Data</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Across 3 categories</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="group p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${action.color}-50 dark:bg-${action.color}-900/30 flex items-center justify-center`}>
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Demo Data</p>
                  </div>
                  <Link
                    href="/transactions"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'Buy' ? 'bg-green-50 dark:bg-green-900/30' :
                          transaction.type === 'Sell' ? 'bg-red-50 dark:bg-red-900/30' :
                          'bg-blue-50 dark:bg-blue-900/30'
                        }`}>
                          {transaction.type === 'Buy' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                           transaction.type === 'Sell' ? <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" /> :
                           <ArrowUpRight className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.type} {transaction.asset}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.amount}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Popular Assets</h2>
                  </div>
                </div>
                <div className="space-y-3">
                  {popularAssets.map((asset) => (
                    <Link
                      key={asset.symbol}
                      href={asset.href}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                          {asset.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{asset.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{asset.price}</p>
                        <p className={`text-sm ${
                          asset.change.startsWith('+')
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {asset.change}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Settings & Support */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Settings & Support</h2>
                <div className="space-y-2">
                  {settings.map((setting) => (
                    <Link
                      key={setting.name}
                      href={setting.href}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                          {setting.icon}
                        </div>
                        <span className="text-gray-900 dark:text-white">{setting.name}</span>
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
