'use client'
import React from 'react'
import AdminCryptoBarChart from './admin-crypto-bar-chart'
import AdminCryptoDonutChart from './admin-crypto-donut-chart'

export default function AdminAnalyticsSection() {
  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="space-y-6">
        {/* Bar Chart */}
        <AdminCryptoBarChart />

        {/* Donut Chart */}
        <AdminCryptoDonutChart />
      </div>
    </div>
  )
}
