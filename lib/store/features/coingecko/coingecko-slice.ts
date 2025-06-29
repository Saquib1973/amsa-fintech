import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as coingeckoService from '@/services/coingecko-service'
import type {
  SearchCoin,
  MarketData,
  QueryResult,
  SortConfig,
} from '@/context/types'
import type {
  TrendingCoinsData,
  CoinsData,
  CoinData,
} from '@/types/coingecko-types'

interface CoingeckoState {
  coinsData: CoinsData[] | null
  trendingCoinsData: TrendingCoinsData[] | null
  queryCoinsData: QueryResult | null
  coinData: CoinData | null
  loadingCoinsData: boolean
  loadingTrendingCoinsData: boolean
  loadingQueryCoinsData: boolean
  loadingCoinData: boolean
  currentPage: number
  sortConfig: SortConfig
  error: string | null
}

const initialState: CoingeckoState = {
  coinsData: null,
  trendingCoinsData: null,
  queryCoinsData: null,
  coinData: null,
  loadingCoinsData: true,
  loadingTrendingCoinsData: false,
  loadingQueryCoinsData: false,
  loadingCoinData: false,
  currentPage: 1,
  sortConfig: { key: 'market_cap', direction: 'desc' },
  error: null,
}

// Async thunks
export const fetchCoinsData = createAsyncThunk(
  'coingecko/fetchCoinsData',
  async ({
    page,
    sortBy,
    sortOrder,
  }: {
    page: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }) => {
    const data = await coingeckoService.getCoinsData(page, sortBy, sortOrder)
    return data
  }
)

export const fetchTrendingCoinsData = createAsyncThunk(
  'coingecko/fetchTrendingCoinsData',
  async () => {
    const data = await coingeckoService.getTrendingCoins()
    return [data]
  }
)

export const fetchQueryCoinsData = createAsyncThunk(
  'coingecko/fetchQueryCoinsData',
  async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return { coins: [] } as QueryResult
    }

    const searchData = await coingeckoService.searchCoins(searchQuery)
    if (searchData.coins.length === 0) {
      return { coins: [] } as QueryResult
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

    return combinedData
  }
)

export const fetchCoinById = createAsyncThunk(
  'coingecko/fetchCoinById',
  async (id: string) => {
    if (!id) throw new Error('Coin ID is required')
    const data = await coingeckoService.getCoinById(id)
    return data
  }
)

const coingeckoSlice = createSlice({
  name: 'coingecko',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload
    },
    clearQueryData: (state) => {
      state.queryCoinsData = null
    },
    clearCoinData: (state) => {
      state.coinData = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Coins Data
    builder
      .addCase(fetchCoinsData.pending, (state) => {
        state.loadingCoinsData = true
        state.error = null
      })
      .addCase(fetchCoinsData.fulfilled, (state, action) => {
        state.loadingCoinsData = false
        state.coinsData = action.payload
      })
      .addCase(fetchCoinsData.rejected, (state, action) => {
        state.loadingCoinsData = false
        state.error = action.error.message || 'Failed to fetch coins data'
      })

    // Fetch Trending Coins
    builder
      .addCase(fetchTrendingCoinsData.pending, (state) => {
        state.loadingTrendingCoinsData = true
        state.error = null
      })
      .addCase(fetchTrendingCoinsData.fulfilled, (state, action) => {
        state.loadingTrendingCoinsData = false
        state.trendingCoinsData = action.payload
      })
      .addCase(fetchTrendingCoinsData.rejected, (state, action) => {
        state.loadingTrendingCoinsData = false
        state.error = action.error.message || 'Failed to fetch trending coins'
      })

    // Fetch Query Coins
    builder
      .addCase(fetchQueryCoinsData.pending, (state) => {
        state.loadingQueryCoinsData = true
        state.error = null
      })
      .addCase(fetchQueryCoinsData.fulfilled, (state, action) => {
        state.loadingQueryCoinsData = false
        state.queryCoinsData = action.payload
      })
      .addCase(fetchQueryCoinsData.rejected, (state, action) => {
        state.loadingQueryCoinsData = false
        state.error = action.error.message || 'Failed to fetch query results'
      })

    // Fetch Coin by ID
    builder
      .addCase(fetchCoinById.pending, (state) => {
        state.loadingCoinData = true
        state.error = null
      })
      .addCase(fetchCoinById.fulfilled, (state, action) => {
        state.loadingCoinData = false
        state.coinData = action.payload
      })
      .addCase(fetchCoinById.rejected, (state, action) => {
        state.loadingCoinData = false
        state.error = action.error.message || 'Failed to fetch coin data'
      })
  },
})

export const { setCurrentPage, setSortConfig, clearQueryData, clearCoinData } =
  coingeckoSlice.actions

export default coingeckoSlice.reducer
