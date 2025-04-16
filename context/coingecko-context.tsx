'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react'
import * as coingeckoService from '@/services/coingecko-service'
import {
  type CoingeckoContextType,
  type SearchCoin,
  type SortConfig,
  type QueryResult,
  type MarketData,
} from '@/context/types'
import type {
  TrendingCoinsData,
  CoinsData,
  CoinData,
} from '@/types/coingecko-types'
const CoingeckoContext = createContext<CoingeckoContextType>({
  coinsData: null,
  setCoinsData: () => {},
  trendingCoinsData: null,
  setTrendingCoinsData: () => {},
  queryCoinsData: null,
  setQueryCoinsData: () => {},
  coinData: null,
  loadingCoinsData: false,
  loadingTrendingCoinsData: false,
  loadingQueryCoinsData: false,
  loadingCoinData: false,
  currentPage: 1,
  setCurrentPage: () => {},
  sortConfig: { key: 'market_cap', direction: 'desc' },
  setSortConfig: () => {},
  fetchCoinsData: async () => {},
  fetchTrendingCoinsData: async () => {},
  fetchQueryCoinsData: async () => {},
  fetchCoinById: async () => {},
})

const useCoingecko = () => {
  const context = useContext(CoingeckoContext)
  if (!context) {
    throw new Error('useCoingecko must be used within a CoingeckoProvider')
  }
  return context
}

export const CoingeckoProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [loadingCoinsData, setLoadingCoinsData] = useState(false)
  const [loadingTrendingCoinsData, setLoadingTrendingCoinsData] =
    useState(false)
  const [loadingQueryCoinsData, setLoadingQueryCoinsData] = useState(false)
  const [loadingCoinData, setLoadingCoinData] = useState(false)

  const [coinsData, setCoinsData] = useState<CoinsData[] | null>(null)
  const [trendingCoinsData, setTrendingCoinsData] = useState<
    TrendingCoinsData[] | null
  >(null)
  const [queryCoinsData, setQueryCoinsData] = useState<QueryResult | null>(null)
  const [coinData, setCoinData] = useState<CoinData | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'market_cap',
    direction: 'desc',
  })

  const fetchCoinById = useCallback(async (id: string) => {
    if (!id) return

    setLoadingCoinData(true)
    try {
      const data = await coingeckoService.getCoinById(id)
      setCoinData(data)
    } catch (err) {
      console.error('Error fetching coin data:', err)
      setCoinData(null)
    } finally {
      setLoadingCoinData(false)
    }
  }, [])

  const fetchQueryCoinsData = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setQueryCoinsData(null)
        setLoadingQueryCoinsData(false)
        return
      }

      if (loadingQueryCoinsData) return

      setLoadingQueryCoinsData(true)
      try {
        const searchData = await coingeckoService.searchCoins(searchQuery)

        if (searchData.coins.length === 0) {
          setQueryCoinsData({ coins: [] } as QueryResult)
          return
        }

        const coinIds = searchData.coins
          .slice(0, 10)
          .map((coin: SearchCoin) => coin.id)
          .join(',')
        const marketData = await coingeckoService.getCoinsMarketData(coinIds)

        const combinedData: QueryResult = {
          coins: searchData.coins.slice(0, 10).map((searchCoin: SearchCoin) => {
            const marketInfo = marketData.find(
              (market: MarketData) => market.id === searchCoin.id
            )
            return {
              item: {
                ...searchCoin,
                ...marketInfo,
                large: searchCoin.large || marketInfo?.image,
              },
            }
          }),
        }

        setQueryCoinsData(combinedData)
      } catch (err) {
        console.error('Error fetching search data:', err)
        setQueryCoinsData(null)
      } finally {
        setLoadingQueryCoinsData(false)
      }
    },
    [loadingQueryCoinsData]
  )

  const fetchTrendingCoinsData = useCallback(async () => {
    setLoadingTrendingCoinsData(true)
    try {
      const data = await coingeckoService.getTrendingCoins()
      setTrendingCoinsData([data])
    } catch (err) {
      console.error('Error fetching trending coins:', err)
      setTrendingCoinsData(null)
    } finally {
      setLoadingTrendingCoinsData(false)
    }
  }, [])

  const fetchCoinsData = useCallback(
    async (page: number, sortBy: string, sortOrder: 'asc' | 'desc') => {
      try {
        setLoadingCoinsData(true)
        const data = await coingeckoService.getCoinsData(
          page,
          sortBy,
          sortOrder
        )
        setCoinsData(data)
      } catch (err) {
        console.error('Error fetching coins data:', err)
        setCoinsData(null)
      } finally {
        setLoadingCoinsData(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchCoinsData(currentPage, sortConfig.key, sortConfig.direction)
  }, [currentPage, sortConfig])

  useEffect(() => {
    fetchTrendingCoinsData()
  }, [])

  const contextValue = useMemo(
    () => ({
      coinsData,
      setCoinsData,
      trendingCoinsData,
      setTrendingCoinsData,
      queryCoinsData,
      setQueryCoinsData,
      coinData,
      loadingCoinsData,
      loadingTrendingCoinsData,
      loadingQueryCoinsData,
      loadingCoinData,
      currentPage,
      setCurrentPage,
      sortConfig,
      setSortConfig,
      fetchCoinsData,
      fetchTrendingCoinsData,
      fetchQueryCoinsData,
      fetchCoinById,
    }),
    [
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
      fetchCoinsData,
      fetchTrendingCoinsData,
      fetchQueryCoinsData,
      fetchCoinById,
    ]
  )

  return (
    <CoingeckoContext.Provider value={contextValue}>
      {children}
    </CoingeckoContext.Provider>
  )
}

export default useCoingecko
