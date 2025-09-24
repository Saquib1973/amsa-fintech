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
  networksCount: number
  networks: string[]
  chains?: {
    name: string
    allowed: boolean
    min: number | null
    max: number | null
  }[]
  allowedCount?: number
}

interface Props {
  items?: AvailableAssetItem[]
}

// Client-safe base URL (avoid importing from server-only modules)
const TRANSAK_CRYPTOCOVERAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TRANSAK_ENV === 'PROD'
    ? 'https://api.transak.com/cryptocoverage/api/v1/public'
    : 'https://api-stg.transak.com/cryptocoverage/api/v1/public'

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

function getGroupKey(symbol?: string, coinId?: string) {
  const base = (coinId || symbol || '').trim().toLowerCase()
  return base
}

function groupAssets(all: TransakCryptoCurrency[]): AvailableAssetItem[] {
  const groups = new Map<string, TransakCryptoCurrency[]>()
  for (const currency of all) {
    const key = getGroupKey(currency.symbol, currency.coinId)
    if (!key) continue
    const list = groups.get(key) || []
    list.push(currency)
    groups.set(key, list)
  }

  return Array.from(groups.values())
    .map((list) => {
      const primary = list[0]
      const idForRoute = (primary.coinId || primary.symbol || '').toLowerCase()
      const name = primary.name
      const symbol = (primary.symbol || '').toUpperCase()
      const img =
        primary.image?.small || primary.image?.thumb || primary.image?.large

      // Build unique chain list with simple allowed flag aggregation
      const chainAllowedByName = new Map<string, boolean>()
      for (const item of list) {
        const chainName = (item.network?.name || '').trim() || '-'
        const allowed = !!item.isPayInAllowed
        chainAllowedByName.set(
          chainName,
          chainAllowedByName.get(chainName) || false || allowed
        )
      }
      const chains = Array.from(chainAllowedByName.entries())
        .map(([name, allowed]) => ({
          name,
          allowed,
          min: null as number | null,
          max: null as number | null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      return {
        idForRoute,
        name,
        symbol,
        img,
        networksCount: chains.length,
        networks: chains.map((c) => c.name),
        chains,
        allowedCount: chains.filter((c) => c.allowed).length,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
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
        const res = await fetch(
          `${TRANSAK_CRYPTOCOVERAGE_BASE_URL}/crypto-currencies`,
          {
            method: 'GET',
            headers: { accept: 'application/json' },
            cache: 'no-store',
          }
        )
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
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Symbol</div>
            <div className="col-span-4">Networks</div>
          </div>
          <ul className="divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="px-6 py-3">
                <div className="grid grid-cols-12 items-center animate-pulse">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                    <div className="space-y-2 w-1/2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="col-span-4 flex gap-2">
                    <div className="h-5 bg-gray-100 rounded w-16" />
                    <div className="h-5 bg-gray-100 rounded w-16" />
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
          <div className="col-span-6">Name</div>
          <div className="col-span-2">Symbol</div>
          <div className="col-span-4">Networks</div>
        </div>
        <motion.ul
          layout
          className="divide-y divide-gray-200 dark:divide-gray-800"
        >
          <AnimatePresence initial={false} mode="sync">
            {filtered.map((g) => {
              const chains = g.chains || []
              const visible = chains.slice(0, 3)
              const remaining = Math.max(0, chains.length - visible.length)
              return (
                <motion.li
                  layout
                  key={g.idForRoute}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Link
                    href={`/assets/${g.idForRoute}?tab=overview`}
                    className="block px-6 py-3 hover:bg-gray-50 rounded-sm"
                  >
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-6 flex items-center gap-3 min-w-0">
                        {g.img ? (
                          <Image
                            src={g.img}
                            alt={g.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                        )}
                        <div className="truncate">
                          <div className="text-gray-900 dark:text-gray-100 truncate">
                            {g.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {g.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-gray-700 dark:text-gray-300 uppercase text-sm">
                        {g.symbol}
                      </div>
                      <div className="col-span-4">
                        <div className="flex flex-wrap gap-2">
                          {visible.map((c) => {
                            const badgeClass = c.allowed
                              ? 'inline-flex items-center gap-2 rounded bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 text-xs'
                              : 'inline-flex items-center gap-2 rounded bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 px-2 py-0.5 text-xs'
                            return (
                              <span key={c.name} className={badgeClass}>
                                <span className="font-medium">{c.name}</span>
                              </span>
                            )
                          })}
                          {remaining > 0 && (
                            <span className="inline-flex items-center rounded bg-gray-100 text-gray-700 px-2 py-0.5 text-xs">
                              +{remaining}
                            </span>
                          )}
                        </div>
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
