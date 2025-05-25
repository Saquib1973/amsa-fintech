import TransactionHistory from '@/components/(protected-user)/analytics/transaction-history'
import { getSession } from '@/lib/auth'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import {
  Coins,
  CreditCard,
  User,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'

const quickLinks = [
  {
    label: 'Assets',
    href: '/assets',
    icon: <Coins className="w-7 h-7 text-blue-600" />,
    desc: 'View and manage your assets',
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: <CreditCard className="w-7 h-7 text-blue-600" />,
    desc: 'See your transaction history',
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <User className="w-7 h-7 text-blue-600" />,
    desc: 'Manage your profile',
  },
  {
    label: 'Wallets',
    href: '/wallets',
    icon: <Wallet className="w-7 h-7 text-blue-600" />,
    desc: 'Manage your wallets',
  },
]

const DashboardPage = async () => {
  const session = await getSession()

  return (
    <AnimateWrapper>
      <div className="bg-white dark:bg-black">
        <OffWhiteHeadingContainer>
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
              <Link
                href="/"
                className="text-6xl font-light hover:text-blue-400 transition-colors"
              >
                AMSA Fintech
              </Link>
              <p className="text-xl text-gray-600 dark:text-gray-400 text-left mt-2 font-light">
                Welcome back, {session?.user?.email}
              </p>
            </div>
          </div>
        </OffWhiteHeadingContainer>
        <div className="px-8 my-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl p-6 flex flex-col items-center text-center border border-gray-200 bg-surface-main transition group shadow-sm"
                title={link.desc}
              >
                <div className="mb-3 transition-transform">{link.icon}</div>
                <div className="font-semibold text-lg mb-1">
                  {link.label}
                </div>
                <div className="text-xs text-gray-500">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-8 mb-12">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <TransactionHistory />
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardPage