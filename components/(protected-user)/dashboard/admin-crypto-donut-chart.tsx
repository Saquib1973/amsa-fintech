'use client'
import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import LoaderComponent from '@/components/loader-component'

interface Transaction {
  id: string
  cryptoCurrency: string
  fiatAmount: number
}

const AdminCryptoDonutChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cryptoMap, setCryptoMap] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/admin/transactions')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const transactions = await response.json()
        setUpNewDataStructure(transactions)
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

  function setUpNewDataStructure(data: Transaction[]) {
    if (!Array.isArray(data)) {
      console.error('Transactions is not an array:', data)
      return
    }

    console.log('Total transactions received:', data.length)
    const newMap: { [key: string]: number } = {}
    for (const transaction of data) {
      const crypto = transaction.cryptoCurrency
      const amount = Number(transaction.fiatAmount)
      
      if (newMap[crypto]) {
        newMap[crypto] += amount
      } else {
        newMap[crypto] = amount
      }
    }
    console.log('Cryptocurrency breakdown:', newMap)
    setCryptoMap(newMap)
  }

  useEffect(() => {
    if (Object.keys(cryptoMap).length === 0 || !chartRef.current) {
      return
    }

    const sortedCryptos = Object.entries(cryptoMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Top 10 cryptocurrencies

    const labels = sortedCryptos.map(([crypto]) => crypto)
    const dataValues = sortedCryptos.map(([, amount]) => amount)

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(251, 146, 60, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(14, 165, 233, 0.8)',
      'rgba(132, 204, 22, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(192, 132, 252, 0.8)',
    ]

    const data = {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          title: {
            display: true,
            text: 'Cryptocurrency Distribution',
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: $${value.toFixed(2)} (${percentage}%)`
              },
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
  }, [cryptoMap])

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

  if (Object.keys(cryptoMap).length === 0) {
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

export default AdminCryptoDonutChart
