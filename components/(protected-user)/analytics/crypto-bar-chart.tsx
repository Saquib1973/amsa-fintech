'use client'
import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import LoaderComponent from '@/components/loader-component'
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

const CryptoBarChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [monthlyData, setMonthlyData] = useState<{
    [key: string]: { [key: string]: number }
  }>({})
  // Fetch-only effect; no need for an AbortController since we don't stream
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const data = await response.json()
        processTransactionData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()

    return () => {}
  }, [])

  function processTransactionData(data: Transaction[]) {
    const newMonthlyData: { [key: string]: { [key: string]: number } } = {}

    data.forEach((transaction) => {
      const date = new Date(transaction.createdAt)
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!newMonthlyData[yearMonth]) {
        newMonthlyData[yearMonth] = {}
      }

      if (!newMonthlyData[yearMonth][transaction.cryptoCurrency]) {
        newMonthlyData[yearMonth][transaction.cryptoCurrency] = 0
      }

      newMonthlyData[yearMonth][transaction.cryptoCurrency] +=
        transaction.fiatAmount
    })

    setMonthlyData(newMonthlyData)
  }

  useEffect(() => {
    setLoading(true)
    if (Object.keys(monthlyData).length === 0) {
      setError('No data available')
      return
    }
    setError(null)
    const months = Object.keys(monthlyData).sort((a, b) => a.localeCompare(b))
    const cryptos = new Set<string>()

    months.forEach((month) => {
      Object.keys(monthlyData[month]).forEach((crypto) => {
        cryptos.add(crypto)
      })
    })

    const datasets = Array.from(cryptos).map((crypto) => ({
      label: crypto,
      data: months.map((month) => monthlyData[month][crypto] || 0),
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
      borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
      borderWidth: 1,
    }))

    const data = {
      labels: months.map((month) => {
        const [year, monthNum] = month.split('-')
        return `${monthNum}/${year}`
      }),
      datasets,
    }

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Transaction Amount',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Month/Year',
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Crypto Transactions by Month',
            },
          },
        },
      })
    }

    setLoading(false)
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [monthlyData])

  if (loading)
    return (
      <div className="w-full border rounded border-gray-200 p-4 h-[400px] flex justify-center items-center">
        <LoaderComponent message="Loading Bar Chart..." />
      </div>
    )
  if (error)
    return (
      <div className="w-full border rounded border-gray-200 p-4 h-[400px] flex items-center text-gray-500 justify-center">
        {error}
      </div>
    )

  return (
    <div className="w-full border rounded border-gray-200 p-4 h-[400px] flex justify-center">
      <canvas ref={chartRef} />
    </div>
  )
}

export default CryptoBarChart
