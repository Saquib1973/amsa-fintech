'use client'
import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import LoaderComponent from '@/components/loader-component'

interface Transaction {
  id: string
  isBuyOrSell: string
  fiatAmount: number
  cryptoCurrency: string
  createdAt: string
}

const AdminCryptoBarChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [monthlyData, setMonthlyData] = useState<{
    [key: string]: { [key: string]: number }
  }>({})

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/admin/transactions')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const transactions = await response.json()
        processTransactionData(transactions)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [])

  function processTransactionData(data: Transaction[]) {
    if (!Array.isArray(data)) {
      console.error('Transactions is not an array:', data)
      return
    }

    console.log('Bar chart - Total transactions received:', data.length)
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

      newMonthlyData[yearMonth][transaction.cryptoCurrency] += Number(transaction.fiatAmount)
    })

    console.log('Bar chart - Monthly data:', newMonthlyData)
    setMonthlyData(newMonthlyData)
  }

  useEffect(() => {
    if (Object.keys(monthlyData).length === 0 || !chartRef.current) {
      return
    }

    const months = Object.keys(monthlyData).sort((a, b) => a.localeCompare(b))
    const cryptos = new Set<string>()

    months.forEach((month) => {
      Object.keys(monthlyData[month]).forEach((crypto) => {
        cryptos.add(crypto)
      })
    })

    const colors = [
      { bg: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)' },
      { bg: 'rgba(34, 197, 94, 0.5)', border: 'rgb(34, 197, 94)' },
      { bg: 'rgba(251, 146, 60, 0.5)', border: 'rgb(251, 146, 60)' },
      { bg: 'rgba(168, 85, 247, 0.5)', border: 'rgb(168, 85, 247)' },
      { bg: 'rgba(236, 72, 153, 0.5)', border: 'rgb(236, 72, 153)' },
    ]

    const datasets = Array.from(cryptos).map((crypto, index) => ({
      label: crypto,
      data: months.map((month) => monthlyData[month][crypto] || 0),
      backgroundColor: colors[index % colors.length].bg,
      borderColor: colors[index % colors.length].border,
      borderWidth: 2,
    }))

    const data = {
      labels: months.map((month) => {
        const [year, monthNum] = month.split('-')
        return `${monthNum}/${year}`
      }),
      datasets,
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Transaction Amount ($)',
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
            text: 'Platform Transaction Volume by Month',
            font: {
              size: 16,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [monthlyData])

  if (loading) {
    return (
      <div className="w-full border rounded-md border-gray-100 p-4 h-[400px] flex justify-center items-center bg-white">
        <LoaderComponent message="Loading chart..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full border rounded-md border-gray-100 p-4 h-[400px] flex items-center text-red-500 justify-center bg-white">
        Error: {error}
      </div>
    )
  }

  if (Object.keys(monthlyData).length === 0) {
    return (
      <div className="w-full border rounded-md border-gray-100 p-4 h-[400px] flex items-center text-gray-500 justify-center bg-white">
        No transaction data available
      </div>
    )
  }

  return (
    <div className="w-full border rounded-md border-gray-100 p-4 h-[400px] bg-white">
      <canvas ref={chartRef} />
    </div>
  )
}

export default AdminCryptoBarChart
