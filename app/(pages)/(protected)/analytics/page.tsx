'use client'
import React, { useEffect, useState } from 'react'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { SimpleButton } from '@/components/ui/simple-button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { DollarSign } from 'lucide-react'

interface Transaction {
  id: string
  isBuyOrSell: 'BUY' | 'SELL'
  fiatAmount: number
  fiatCurrency: string
  cryptoCurrency: string
  walletAddress: string
  walletLink: string
  network: string
  createdAt: string
  updatedAt: string
  userId: string
}

interface AnalyticsData {
  totalSpent: number
  totalTransactions: number
  averageTransaction: number
  mostActiveDay: string
  mostActiveCrypto: string
  buyVsSellRatio: number
  weeklyTrend: number
  monthlyTrend: number
  recentActivity: { date: string; count: number; amount: number }[]
  cryptoBreakdown: { label: string; value: number }[]
  networkBreakdown: { label: string; value: number }[]
}

const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const chartData = data.map((item) => item.value)
  const categories = data.map((item) => item.label)
  const options: Highcharts.Options = {
    chart: { type: 'column', height: 400 },
    title: { text: 'Bar Chart', style: { fontSize: '16px', fontWeight: 'normal' } },
    xAxis: { categories, title: { text: 'Crypto' } },
    yAxis: { title: { text: 'Total Amount' } },
    series: [
      {
        type: 'column',
        name: 'Total Amount',
        data: chartData,
        color: '#3B82F6',
      },
    ],
    tooltip: {
      valueDecimals: 2,
    },
  }
  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

const DonutChart = ({ data, title }: { data: { label: string; value: number }[], title: string }) => {
  const chartData = data.map((item) => ({ name: item.label, y: item.value }))
  const options: Highcharts.Options = {
    chart: { type: 'pie', height: 300 },
    title: { text: title, style: { fontSize: '16px', fontWeight: 'normal' } },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: { enabled: true },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Total Amount',
        data: chartData,
      },
    ],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
    },
  }
  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

const LineChart = ({ data, title }: { data: { date: string; count: number; amount: number }[], title: string }) => {
  const options: Highcharts.Options = {
    chart: { type: 'line', height: 300 },
    title: { text: title, style: { fontSize: '16px', fontWeight: 'normal' } },
    xAxis: {
      categories: data.map(item => format(new Date(item.date), 'MMM dd')),
      title: { text: 'Date' }
    },
    yAxis: { title: { text: 'Amount' } },
    series: [
      {
        type: 'line',
        name: 'Transaction Amount',
        data: data.map(item => item.amount),
        color: '#3B82F6',
      },
    ],
    tooltip: {
      valueDecimals: 2,
    },
  }
  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}



const Page = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const calculateAnalytics = (transactions: Transaction[]): AnalyticsData => {
    if (transactions.length === 0) {
      return {
        totalSpent: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        mostActiveDay: 'No data',
        mostActiveCrypto: 'No data',
        buyVsSellRatio: 0,
        weeklyTrend: 0,
        monthlyTrend: 0,
        recentActivity: [],
        cryptoBreakdown: [],
        networkBreakdown: []
      }
    }

    // Basic calculations
    const totalSpent = transactions.reduce((sum, tx) => sum + Number(tx.fiatAmount), 0)
    const totalTransactions = transactions.length
    const averageTransaction = totalSpent / totalTransactions

    // Most active crypto
    const cryptoCounts: { [key: string]: number } = {}
    transactions.forEach(tx => {
      cryptoCounts[tx.cryptoCurrency] = (cryptoCounts[tx.cryptoCurrency] || 0) + 1
    })
    const mostActiveCrypto = Object.entries(cryptoCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'No data'

    // Buy vs Sell ratio
    const buyCount = transactions.filter(tx => tx.isBuyOrSell === 'BUY').length
    const buyVsSellRatio = (buyCount / totalTransactions) * 100

    // Recent activity (last 7 days)
    const recentActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      const dayTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.createdAt)
        return txDate >= dayStart && txDate <= dayEnd
      })

      recentActivity.push({
        date: format(date, 'yyyy-MM-dd'),
        count: dayTransactions.length,
        amount: dayTransactions.reduce((sum, tx) => sum + Number(tx.fiatAmount), 0)
      })
    }

    // Most active day
    const dayCounts: { [key: string]: number } = {}
    transactions.forEach(tx => {
      const day = format(new Date(tx.createdAt), 'EEEE')
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })
    const mostActiveDay = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'No data'

    // Crypto breakdown
    const cryptoBreakdown: { [key: string]: number } = {}
    transactions.forEach(tx => {
      cryptoBreakdown[tx.cryptoCurrency] = (cryptoBreakdown[tx.cryptoCurrency] || 0) + Number(tx.fiatAmount)
    })

    // Network breakdown
    const networkBreakdown: { [key: string]: number } = {}
    transactions.forEach(tx => {
      networkBreakdown[tx.network] = (networkBreakdown[tx.network] || 0) + Number(tx.fiatAmount)
    })

    // Weekly and monthly trends (simplified)
    const weeklyTrend = recentActivity.slice(-7).reduce((sum, day) => sum + day.amount, 0)
    const monthlyTrend = totalSpent // Simplified for now

    return {
      totalSpent,
      totalTransactions,
      averageTransaction,
      mostActiveDay,
      mostActiveCrypto,
      buyVsSellRatio,
      weeklyTrend,
      monthlyTrend,
      recentActivity,
      cryptoBreakdown: Object.entries(cryptoBreakdown).map(([label, value]) => ({ label, value })),
      networkBreakdown: Object.entries(networkBreakdown).map(([label, value]) => ({ label, value }))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/transactions')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const transactions: {
          data: Transaction[],
          length: number,
          numberOfTransactions: number
        } = await response.json()

        const analytics = calculateAnalytics(transactions.data)
        setAnalyticsData(analytics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <AnimateWrapper>
      <div className="min-h-screen bg-gray-50/50">
        <OffWhiteHeadingContainer>
          <div>
            <h1 className="text-4xl md:text-5xl font-light">Analytics</h1>
            <p className="text-xl text-gray-500 mt-2 font-light">Visualize your crypto activity and trends</p>
          </div>
        </OffWhiteHeadingContainer>
        <SectionWrapper className="py-6 md:py-12">
          <div className="w-full space-y-8">
            <div className="flex justify-end">
              <SimpleButton
                variant="secondary-outlined"
                onClick={() => router.push('/transactions')}
              >
                View All Transactions
              </SimpleButton>
            </div>

            {loading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              </div>
            ) : error ? (
              <div className="w-full flex justify-center items-center h-[400px] text-red-500">{error}</div>
            ) : analyticsData ? (
              <>
                                                {/* Hero Stats Section */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 via-white to-blue-50/30 border border-gray-100">
                  <div className="relative p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Main Stat */}
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600">Total Investment</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 break-words">
                          ${analyticsData.totalSpent.toLocaleString()}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Across {analyticsData.totalTransactions} transactions</p>
                      </div>

                      {/* Secondary Stats */}
                      <div className="flex flex-row sm:flex-col lg:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
                        <div className="text-center flex-1 lg:flex-none">
                          <div className="text-base sm:text-lg font-semibold text-gray-900">${analyticsData.averageTransaction.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Average per transaction</div>
                        </div>
                        <div className="text-center flex-1 lg:flex-none">
                          <div className="text-base sm:text-lg font-semibold text-gray-900">{analyticsData.mostActiveDay}</div>
                          <div className="text-xs text-gray-500">Most active day</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-100 md:shadow-sm">
                    <BarChart data={analyticsData.cryptoBreakdown} />
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-100 md:shadow-sm">
                    <DonutChart data={analyticsData.cryptoBreakdown} title="Crypto Distribution" />
                  </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-100 md:shadow-sm">
                    <LineChart data={analyticsData.recentActivity} title="Recent Activity (7 Days)" />
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-100 md:shadow-sm">
                    <DonutChart data={analyticsData.networkBreakdown} title="Network Distribution" />
                  </div>
                </div>

                                                {/* Additional Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-100 md:shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Insights</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buy vs Sell Ratio:</span>
                        <span className="font-semibold">{analyticsData.buyVsSellRatio.toFixed(1)}% Buy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Most Active Crypto:</span>
                        <span className="font-semibold">{analyticsData.mostActiveCrypto}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly Volume:</span>
                        <span className="font-semibold">${analyticsData.weeklyTrend.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-100 md:shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => router.push('/transactions')}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">View All Transactions</div>
                        <div className="text-sm text-gray-500">See your complete transaction history</div>
                      </button>
                      <button
                        onClick={() => router.push('/assets')}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">Browse Assets</div>
                        <div className="text-sm text-gray-500">Explore available cryptocurrencies</div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}

export default Page
