'use client'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { DataTable } from '@/components/ui/data-table'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

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

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transaction')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const data = await response.json()
        setTransactions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const columns = [
    {
      header: 'Type',
      accessorKey: 'isBuyOrSell' as const,
      cell: (value: string | number | boolean | null | undefined) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'BUY'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'fiatAmount' as const,
      cell: (
        value: string | number | boolean | null | undefined,
        row: Transaction
      ) => `${String(value)} ${row.fiatCurrency}`,
    },
    {
      header: 'Crypto',
      accessorKey: 'cryptoCurrency' as const,
    },
    {
      header: 'Network',
      accessorKey: 'network' as const,
    },
    {
      header: 'Wallet',
      accessorKey: 'walletAddress' as const,
      cell: (
        value: string | number | boolean | null | undefined,
        row: Transaction
      ) => (
        <Link
          href={row.walletLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          title={String(value)}
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt' as const,
      cell: (value: string | number | boolean | null | undefined) =>
        format(new Date(String(value)), 'MMM d, yyyy HH:mm'),
    },
    {
      header: 'Updated',
      accessorKey: 'updatedAt' as const,
      cell: (value: string | number | boolean | null | undefined) =>
        format(new Date(String(value)), 'MMM d, yyyy HH:mm'),
    },
  ]

  if (error) return <div className="text-red-500 text-center">{error}</div>
  if (transactions.length === 0 && !loading)
    return (
      <div className="text-center text-gray-500">No transactions found</div>
    )

  return <DataTable columns={columns} data={transactions} isLoading={loading} />
}

export default TransactionHistory
