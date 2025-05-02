'use client'
import React, { useEffect, useState, useRef } from 'react'
import useCoingecko from '@/context/coingecko-context'
import { useRouter, useSearchParams } from 'next/navigation'

const SearchCoins = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q"))

  const { fetchQueryCoinsData } = useCoingecko()
  const lastExecutedQuery = useRef('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedQuery = query?.trim() || "";
      if (trimmedQuery !== lastExecutedQuery.current) {
        lastExecutedQuery.current = trimmedQuery
        const newUrl = trimmedQuery
          ? `assets?q=${encodeURIComponent(trimmedQuery)}`
          : 'assets'
        router.push(newUrl,{scroll:false})
        if (trimmedQuery.length > 0) {
          fetchQueryCoinsData(trimmedQuery)
        } else {
          fetchQueryCoinsData('')
        }
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, fetchQueryCoinsData, router])

  return (
    <input
      type="text"
      value={query || ''}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for an asset"
      className="input-field w-full text-sm"
    />
  )
}

export default SearchCoins
