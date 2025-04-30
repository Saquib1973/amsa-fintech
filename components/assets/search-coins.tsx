'use client'
import React, { useEffect, useState, useRef } from 'react'
import useCoingecko from '@/context/coingecko-context'

const SearchCoins = () => {
  const [query, setQuery] = useState('')
  const { fetchQueryCoinsData } = useCoingecko()
  const lastExecutedQuery = useRef('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() !== lastExecutedQuery.current) {
        lastExecutedQuery.current = query.trim()
        if (query.trim().length > 0) {
          fetchQueryCoinsData(query)
        } else {
          fetchQueryCoinsData('')
        }
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, fetchQueryCoinsData])

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for an asset"
      className="w-full border border-gray-200 dark:border-gray-800 dark:text-white outline-none p-2"
    />
  )
}

export default SearchCoins
