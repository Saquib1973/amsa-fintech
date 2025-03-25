export interface TrendingCoinsData {
  coins: Coin[]
  nfts: NFT[]
  categories: Category[]
}

export interface Coin {
  item: {
    id: string
    coin_id: number
    name: string
    symbol: string
    market_cap_rank: number
    thumb: string
    small: string
    large: string
    slug: string
    price_btc: number
    score: number
    data: {
      price: number
      price_btc: string
      price_change_percentage_24h: {
        [currency: string]: number
      }
      market_cap: string
      market_cap_btc: string
      total_volume: string
      total_volume_btc: string
      sparkline: string
      content: {
        title?: string
        description?: string
      } | null
    }
  }
}

export interface NFT {
  id: string
  name: string
  symbol: string
  thumb: string
  nft_contract_id: number
  native_currency_symbol: string
  floor_price_in_native_currency: number
  floor_price_24h_percentage_change: number
  data: {
    floor_price: string
    floor_price_in_usd_24h_percentage_change: string
    h24_volume: string
    h24_average_sale_price: string
    sparkline: string
    content: {
      title?: string
      description?: string
    } | null
  }
}

interface Category {
  id: number
  name: string
  market_cap_1h_change: number
  slug: string
  coins_count: string
  data: {
    market_cap: number
    market_cap_btc: number
    total_volume: number
    total_volume_btc: number
    market_cap_change_percentage_24h: {
      [currency: string]: number
    }
    sparkline: string
  }
}

export interface CoinsData {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
}

export interface CoinData {
  id: string
  symbol: string
  name: string
  description: {
    en: string
  }
  market_data: {
    market_cap_rank: number
    current_price: {
      usd: number
      aud: number
    }
    market_cap: {
      usd: number
      aud: number
    }
    total_volume: {
      usd: number
      aud: number
    }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
  }
  image: {
    thumb: string
    small: string
    large: string
  }
  last_updated: string
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
    twitter_screen_name: string
    telegram_channel_identifier: string
    subreddit_url: string
  }
}

