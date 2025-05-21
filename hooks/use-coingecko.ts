'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/store.'
import {
  fetchCoinsData,
  fetchTrendingCoinsData,
  fetchQueryCoinsData,
  fetchCoinById,
  setCurrentPage,
  setSortConfig,
  clearQueryData,
} from '@/lib/store/features/coingecko/coingecko-slice'

export const useCoingecko = () => {
  const dispatch = useAppDispatch()
  const {
    coinsData,
    trendingCoinsData,
    queryCoinsData,
    coinData,
    loadingCoinsData,
    loadingTrendingCoinsData,
    loadingQueryCoinsData,
    loadingCoinData,
    currentPage,
    sortConfig,
    error,
  } = useAppSelector((state) => state.coingecko)

  // Fetch coins data when page or sort config changes
  useEffect(() => {
    dispatch(
      fetchCoinsData({
        page: currentPage,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      })
    )
  }, [currentPage, sortConfig, dispatch])

  // Fetch trending coins on mount
  useEffect(() => {
    dispatch(fetchTrendingCoinsData())
  }, [dispatch])

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handleSortChange = (config: {
    key: string
    direction: 'asc' | 'desc'
  }) => {
    dispatch(setSortConfig(config))
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      dispatch(clearQueryData())
      return
    }
    dispatch(fetchQueryCoinsData(query))
  }

  const handleFetchCoin = async (id: string) => {
    if (!id) return
    dispatch(fetchCoinById(id))
  }

  return {
    // Data
    coinsData,
    trendingCoinsData,
    queryCoinsData,
    coinData,
    // Loading states
    loadingCoinsData,
    loadingTrendingCoinsData,
    loadingQueryCoinsData,
    loadingCoinData,
    // Pagination and sorting
    currentPage,
    sortConfig,
    // Error state
    error,
    // Actions
    setCurrentPage: handlePageChange,
    setSortConfig: handleSortChange,
    fetchQueryCoinsData: handleSearch,
    fetchCoinById: handleFetchCoin,
  }
}

export default useCoingecko
