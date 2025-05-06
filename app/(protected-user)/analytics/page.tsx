import React from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import CryptoDonutChart from '@/components/(protected-user)/analytics/crypto-donut-chart'
import TransactionHistory from '@/components/(protected-user)/analytics/transaction-history'
import Header from '@/components/header'
import CryptoBarChart from '@/components/(protected-user)/analytics/crypto-bar-chart'
const page = () => {
  return (
    <AnimateWrapper>
      <div className="flex flex-col gap-4 p-2">
        <Header title="Transaction History" />
        <div className="flex flex-col gap-4">
          <TransactionHistory />
          <Header title="Charts" />
          <div className="w-full flex gap-4">
            <CryptoDonutChart />
            <CryptoBarChart />
          </div>
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default page
