'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface AvailableAssetItem {
  idForRoute: string
  name: string
  symbol: string
  img?: string
  network: string
  networkDisplayName: string
  allowed: boolean
  min: number | null
  max: number | null
}

interface Props {
  items?: AvailableAssetItem[]
}

// Use API route to avoid CORS issues

// Minimal shape from Transak we care about for grouping
interface TransakImageSizes {
  large?: string
  small?: string
  thumb?: string
}
interface TransakNetworkInfo {
  name?: string | null
}
interface TransakCryptoCurrency {
  coinId?: string
  name: string
  symbol: string
  image?: TransakImageSizes
  network?: TransakNetworkInfo
  isPayInAllowed?: boolean
  minAmountForPayIn?: number | null
  maxAmountForPayIn?: number | null
}

function groupAssets(all: TransakCryptoCurrency[]): AvailableAssetItem[] {
  // Create separate entries for each network
  const items: AvailableAssetItem[] = []
  
  for (const currency of all) {
    const networkName = (currency.network?.name || '').trim() || 'Unknown'
    const idForRoute = (currency.coinId || currency.symbol || '').toLowerCase()
    const symbol = (currency.symbol || '').toUpperCase()
    
    if (!idForRoute || !symbol) continue
    
    items.push({
      idForRoute,
      name: currency.name,
      symbol,
      img: currency.image?.small || currency.image?.thumb || currency.image?.large,
      network: networkName.toLowerCase().replace(/\s+/g, '-'),
      networkDisplayName: networkName,
      allowed: !!currency.isPayInAllowed,
      min: currency.minAmountForPayIn ?? null,
      max: currency.maxAmountForPayIn ?? null,
    })
  }

  // Sort by name, then by network
  return items.sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name)
    if (nameCompare !== 0) return nameCompare
    return a.networkDisplayName.localeCompare(b.networkDisplayName)
  })
}

export default function AvailableAssetsClient({ items }: Props) {
  const [query, setQuery] = React.useState('')
  const [autoItems, setAutoItems] = React.useState<AvailableAssetItem[] | null>(
    null
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Auto-fetch if items not provided
  React.useEffect(() => {
    if (items && items.length > 0) {
      setAutoItems(null)
      setLoading(false)
      setError(null)
      return
    }

    let isCancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/transak/crypto-currencies', {
          method: 'GET',
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        const json = await res.json()
        const all: TransakCryptoCurrency[] = json?.response || []
        const grouped = groupAssets(all)
        if (!isCancelled) setAutoItems(grouped)
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load assets'
        if (!isCancelled) setError(message)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    load()
    return () => {
      isCancelled = true
    }
  }, [items])

  const sourceItems = React.useMemo(
    () => (items && items.length > 0 ? items : autoItems || []),
    [items, autoItems]
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sourceItems
    return sourceItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) || i.symbol.toLowerCase().includes(q)
    )
  }, [sourceItems, query])

  function renderBody() {
    if (loading) {
      return (
        <div className="h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-12 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-700 sticky top-0 z-10">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Symbol</div>
            <div className="col-span-5">Network</div>
          </div>
          <ul className="divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="px-6 py-3">
                <div className="grid grid-cols-12 items-center animate-pulse">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                    <div className="space-y-2 w-1/2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="col-span-5">
                    <div className="h-5 bg-gray-100 rounded w-20" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    if (filtered.length === 0) {
      return (
        <div className="h-[80vh] flex items-center justify-center text-gray-600 dark:text-gray-300">
          No matching assets.
        </div>
      )
    }

    return (
      <div className="overflow-y-auto h-[80vh]">
        <div className="grid grid-cols-12 border-t border-gray-200 bg-white px-6 py-2 font-medium text-gray-700 sticky top-0 z-10">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Symbol</div>
          <div className="col-span-5">Network</div>
        </div>
        <motion.ul
          layout
          className="divide-y divide-gray-200 dark:divide-gray-800"
        >
          <AnimatePresence initial={false} mode="sync">
            {filtered.map((item, index) => {
              const uniqueKey = `${item.idForRoute}-${item.network}-${index}`
              return (
                <motion.li
                  layout
                  key={uniqueKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Link
                    href={`/assets/${item.idForRoute}?tab=overview&network=${encodeURIComponent(item.network)}`}
                    className="block px-6 py-3 hover:bg-gray-50 rounded-sm"
                  >
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        {item.img ? (
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                        )}
                        <div className="truncate">
                          <div className="text-gray-900 dark:text-gray-100 truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {item.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-gray-700 dark:text-gray-300 uppercase text-sm">
                        {item.symbol}
                      </div>
                      <div className="col-span-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded px-2 py-0.5 text-xs ${
                            item.allowed
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          }`}
                        >
                          <span className="font-medium">{item.networkDisplayName}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for an asset"
        disabled={loading && !error}
        className="input-field rounded-none border-transparent bg-gray-50 w-full p-4 px-4 text-base"
      />
      {items === undefined && (
        <div className="text-xs text-gray-500">
          {error ? `Error: ${error}` : null}
        </div>
      )}

      {renderBody()}
    </div>
  )
}
