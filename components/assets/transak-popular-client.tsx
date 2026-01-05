'use client'

import { useEffect, useState } from 'react'
import TransakCoinList from '@/components/assets/transak-coin-list'
import type { TransakCryptoCurrenciesResponse, TransakCryptoCurrency } from '@/types/transak'

export default function TransakPopularClient() {
  const [coins, setCoins] = useState<TransakCryptoCurrency[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/transak/crypto-currencies', {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as TransakCryptoCurrenciesResponse
        const all = Array.isArray(json.response) ? json.response : []
        const popular = all.filter(c => c.isPayInAllowed).slice(0, 10)
        if (!cancelled) setCoins(popular)
      } catch (e: unknown) {
        if (!cancelled) {
          console.error('Failed to load popular assets from Transak', e)
          setError('Failed to load popular assets from Transak')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-white w-full flex items-stretch flex-col h-fit">
      <h2 className="text-xl font-light px-3 py-2 border-b border-gray-200 dark:border-gray-800 w-full">
        Popular on Transak
      </h2>

      {loading && (
        <div className="p-4 text-sm text-gray-600 dark:text-gray-300">Loading...</div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      {!loading && !error && coins && (
        <div className="text-xs">
          <TransakCoinList coins={coins} />
        </div>
      )}
    </div>
  )
}


