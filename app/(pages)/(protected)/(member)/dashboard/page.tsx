import { TrendingUp, PieChart } from 'lucide-react'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import type { Metadata } from 'next'
import { Transaction } from '@/types/transaction-types'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import {
  getTransactions,
  totalAmountOfTransactions,
} from '@/actions/transactions'
import PopularAssetsSettingsDashboard from '@/components/(protected-user)/dashboard/popular-assets-settings-dashboard'
import RecentTransactionDashboard from '@/components/(protected-user)/dashboard/recent-transaction-dashboard'
import QuickActionsDashboard from '@/components/(protected-user)/dashboard/quick-actions-dashboard'

export const metadata: Metadata = {
  title: 'Dashboard | AMSA Fintech and IT solutions',
  description: 'Dashboard for AMSA Fintech and IT solutions',
  keywords: 'dashboard, AMSA Fintech and IT solutions',
}

const DashboardPage = async () => {
  const transactions = await getTransactions({ recent: true })
  const transactionArr = transactions.data as unknown as Transaction[]

  const txArrLen = transactionArr.length

  const recentTransactions = transactionArr.slice(
    0,
    txArrLen > 8 ? 8 : txArrLen
  )
  const totalCost = txArrLen > 0 ? await totalAmountOfTransactions() : 0

  return (
    <AnimateWrapper>
      <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen font-sans">
        <OffWhiteHeadingContainer>
          <div>
            <h1 className="text-5xl font-light">Dashboard</h1>
          </div>
        </OffWhiteHeadingContainer>

        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4">
              <div className="flex flex-col font-light items-start justify-center gap-1">
                <p className="text-3xl">${totalCost.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex font-light items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="size-8 text-green-600" />
                </div>
                <div className="font-light">
                  <p className="text-3xl">+$1,234.56</p>
                  <p className="text-sm text-gray-500">24h Change</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <PieChart className="size-8 text-purple-600" />
                </div>
                <div className="font-light">
                  <p className="text-3xl">12</p>
                  <p className="text-sm text-gray-500">Active Assets</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <QuickActionsDashboard />
              <RecentTransactionDashboard
                transactions={recentTransactions}
                txArrLen={txArrLen}
              />
            </div>
            <PopularAssetsSettingsDashboard />
          </div>
        </main>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardPage
