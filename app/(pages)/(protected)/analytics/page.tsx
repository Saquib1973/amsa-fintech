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

const DonutChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const chartData = data.map((item) => ({ name: item.label, y: item.value }))
  const options: Highcharts.Options = {
    chart: { type: 'pie', height: 400 },
    title: { text: 'Donut Chart', style: { fontSize: '16px', fontWeight: 'normal' } },
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

const Page = () => {
  const [data, setData] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/transaction')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const transactions: Transaction[] = await response.json()
        // Sum fiatAmount per cryptoCurrency
        const map: { [crypto: string]: number } = {}
        for (const tx of transactions) {
          map[tx.cryptoCurrency] = (map[tx.cryptoCurrency] || 0) + tx.fiatAmount
        }
        setData(Object.entries(map).map(([label, value]) => ({ label, value })))
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
          <div className="w-full">
            <div className="flex justify-end mb-6">
              <SimpleButton
                variant="secondary-outlined"
                onClick={() => {
                  router.push('/transactions')
                }}
              >
                View All Transactions
              </SimpleButton>
            </div>
            {loading ? (
              <div className="w-full flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <Skeleton className="h-[400px] w-full" />
                </div>
                <div className="w-full md:w-1/2">
                  <Skeleton className="h-[400px] w-full" />
                </div>
              </div>
            ) : error ? (
              <div className="w-full flex justify-center items-center h-[400px] text-red-500">{error}</div>
            ) : (
              <div className="w-full flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <BarChart data={data} />
                </div>
                <div className="w-full md:w-1/2">
                  <DonutChart data={data} />
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}

export default Page
