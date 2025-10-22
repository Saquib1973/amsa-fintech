import { TrendingUp, PieChart, TrendingDown } from 'lucide-react'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import type { Metadata } from 'next'
import { Transaction } from '@/types/transaction-types'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import {
  getTransactions,
  totalAmountOfTransactions,
  getNetProfitLoss,
} from '@/actions/transactions'
import AssetsQuickActionsSidebar from '@/components/(protected-user)/dashboard/assets-quick-actions-sidebar'
import RecentTransactionDashboard from '@/components/(protected-user)/dashboard/recent-transaction-dashboard'
import Image from 'next/image'
import HoldingsSection from '@/components/(protected-user)/dashboard/holdings-section'

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
  
  // Get dynamic profit/loss and active assets data
  const { netPLAUD, activeAssetsCount } = await getNetProfitLoss()

  // Holdings section is rendered via a dedicated component

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
            <div className="p-4 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/gif/money-gif.gif"
                  className="rounded-full aspect-square"
                  alt="Total Amount"
                  width={45}
                  height={45}
                />
              </div>
              <div className="flex flex-col font-light items-start justify-center gap-1">
                <p className="text-3xl">${totalCost.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex font-light items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  {netPLAUD >= 0 ? (
                    <TrendingUp className="size-8 text-green-600" />
                  ) : (
                    <TrendingDown className="size-8 text-red-600" />
                  )}
                </div>
                <div className="font-light">
                  <p className={`text-3xl ${netPLAUD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netPLAUD >= 0 ? '+' : ''}${netPLAUD.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Net Profit/Loss</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <PieChart className="size-8 text-purple-600" />
                </div>
                <div className="font-light">
                  <p className="text-3xl">{activeAssetsCount}</p>
                  <p className="text-sm text-gray-500">Active Assets</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <HoldingsSection />
              <RecentTransactionDashboard
                transactions={recentTransactions}
                txArrLen={txArrLen}
              />
            </div>
            <AssetsQuickActionsSidebar />
          </div>
        </main>
      </div>
    </AnimateWrapper>
  )
}

export default DashboardPage
