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
const CryptoDonutChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<{ [key: string]: number[] }>({})
  // Simple fetch; no AbortController needed here

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const data = await response.json()
        setUpNewDataStructure(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()

    return () => {}
  }, [])

  function setUpNewDataStructure(data: Transaction[]) {
    const newMap: { [key: string]: number[] } = {}
    for (const transaction of data) {
      if (newMap[transaction.cryptoCurrency]) {
        newMap[transaction.cryptoCurrency].push(transaction.fiatAmount)
      } else {
        newMap[transaction.cryptoCurrency] = [transaction.fiatAmount]
      }
    }
    setMap(newMap)
  }

  useEffect(() => {
    if (Object.keys(map).length === 0) {
      setError('No data available')
      return
    }
    setError(null)

    const data = {
      labels: Object.keys(map),
      datasets: [
        {
          label: 'Crypto Transactions',
          data: Object.values(map).map((value) => value.reduce((acc, curr) => acc + curr, 0)),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
          ],
          hoverOffset: 4,
        },
      ],
    }

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      chartInstanceRef.current = new Chart(
        chartRef.current,
        {
          type: 'doughnut',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        }
      )
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [map])
  if (loading) return <div className="w-full border rounded border-gray-200 p-4 h-[400px] flex items-center justify-center">
    <LoaderComponent message='Loading Donut Chart...' />
  </div>
  if (error) return <div className="w-full border rounded border-gray-200 p-4 h-[400px] flex items-center text-gray-500 justify-center">{error}</div>
  return (
    <div id="acquisitions" className="w-full border rounded border-gray-200 p-4 h-[400px] flex justify-center">
      <canvas ref={chartRef} />
    </div>
  )
}

export default CryptoDonutChart
