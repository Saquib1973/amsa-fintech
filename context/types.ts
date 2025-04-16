import type {
  TrendingCoinsData,
  CoinsData,
  CoinData,
} from '@/types/coingecko-types'
export interface SearchCoin {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  large?: string
}
export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface MarketData {
  id: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
  image: string
}

export interface QueryResult {
  coins: {
    item: SearchCoin & Partial<MarketData>
  }[]
}

export interface CoingeckoContextType {
  coinsData: CoinsData[] | null
  setCoinsData: (data: CoinsData[] | null) => void
  trendingCoinsData: TrendingCoinsData[] | null
  setTrendingCoinsData: (data: TrendingCoinsData[] | null) => void
  queryCoinsData: QueryResult | null
  setQueryCoinsData: (data: QueryResult | null) => void
  coinData: CoinData | null
  loadingCoinsData: boolean
  loadingTrendingCoinsData: boolean
  loadingQueryCoinsData: boolean
  loadingCoinData: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  sortConfig: SortConfig
  setSortConfig: (config: SortConfig) => void
  fetchQueryCoinsData: (query: string) => Promise<void>
  fetchCoinsData: (
    page: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ) => Promise<void>
  fetchTrendingCoinsData: () => Promise<void>
  fetchCoinById: (id: string) => Promise<void>
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system'
  loading: boolean
}

export interface ThemeContextType {
  theme: ThemeState
  setTheme: (mode: 'light' | 'dark' | 'system') => void
  toggleTheme: (mode: 'light' | 'dark' | 'system') => void
}
