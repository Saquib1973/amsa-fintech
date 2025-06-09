import { getSession } from '@/lib/auth'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import {
  History,
  Settings,
  BarChart3,
  Wallet,
  ChevronRight,
  Bitcoin,
  Coins,
  DollarSign,
  ArrowUpRight,
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

const settings = [
  {
    name: 'Profile Settings',
    href: '/profile',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: 'Security',
    href: '/profile/security',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: 'Notifications',
    href: '/profile/notifications',
    icon: <Settings className="w-5 h-5" />,
  },
]

const DashboardPage = async () => {
  const session = await getSession()

  return (
    <AnimateWrapper>
      <div className="bg-white dark:bg-black min-h-screen">
        <OffWhiteHeadingContainer>
          <div className="flex flex-col py-10">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-1">
              Dashboard
              <p className="text-gray-500 dark:text-gray-400 text-lg mt-2">
                Welcome back,{' '}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {session?.user?.email ? session.user.email.split('@')[0] : ''}
                </span>
                !
              </p>
            </h1>
          </div>
        </OffWhiteHeadingContainer>

        <div className="px-8 mt-10 space-y-8">
          {/* Popular Assets Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Popular Assets
              </h2>
              <Link
                href="/assets"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all assets
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {popularAssets.map((asset) => (
                <Link
                  key={asset.symbol}
                  href={asset.href}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {asset.icon}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {asset.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {asset.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {asset.price}
                    </div>
                    <div
                      className={`text-sm ${
                        asset.change.startsWith('+')
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {asset.change}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Actions Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/transactions"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                      <History className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Transactions
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        View your transaction history
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/wallets"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Wallets
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Manage your wallets
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/analytics"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Analytics
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        View financial insights
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </section>

          {/* Settings Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {settings.map((setting) => (
                <Link
                  key={setting.name}
                  href={setting.href}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                      {setting.icon}
                    </div>
                    <span className="text-gray-900 dark:text-white">
                      {setting.name}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardPage
