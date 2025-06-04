import TransactionHistory from '@/components/(protected-user)/analytics/transaction-history'
import { getSession } from '@/lib/auth'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import { History, Settings, BarChart3, Wallet, PiggyBank } from 'lucide-react'
import Link from 'next/link'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'

const actions = [
  {
    label: 'Assets',
    href: '/assets',
    icon: <PiggyBank className="w-7 h-7 text-blue-600" />,
    desc: 'View and manage your assets',
    color: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: <History className="w-7 h-7 text-orange-600" />,
    desc: 'See your transaction history',
    color: 'bg-orange-50 dark:bg-orange-900/30',
  },
  {
    label: 'Wallets',
    href: '/wallets',
    icon: <Wallet className="w-7 h-7 text-gray-600" />,
    desc: 'Manage your wallets',
    color: 'bg-gray-50 dark:bg-gray-700/50',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-7 h-7 text-gray-600" />,
    desc: 'View financial insights',
    color: 'bg-gray-50 dark:bg-gray-700/50',
  },
  {
    label: 'Settings',
    href: '/profile',
    icon: <Settings className="w-7 h-7 text-gray-600" />,
    desc: 'Account settings',
    color: 'bg-gray-50 dark:bg-gray-700/50',
  },
]

const DashboardPage = async () => {
  const session = await getSession()

  return (
    <AnimateWrapper>
      <div className="bg-white dark:bg-black min-h-screen">
        {/* Hero Section */}
        <OffWhiteHeadingContainer>
          <div className="flex flex-col items-center py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back
              {session?.user?.email
                ? `, ${session.user.email.split('@')[0]}!`
                : '!'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              AMSA Fintech
            </p>
          </div>
        </OffWhiteHeadingContainer>

        {/* Unified Actions Grid */}
        <div className="px-8 mt-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all flex flex-col items-start"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 ${action.color}`}
                >
                  {action.icon}
                </div>
                <div className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {action.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {action.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-8 mt-10 mb-16">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-0 sm:p-4">
            <TransactionHistory />
          </div>
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardPage
