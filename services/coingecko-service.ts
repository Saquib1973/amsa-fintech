
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY ?? ""
const BASE_URL = 'https://api.coingecko.com/api/v3'

const headers = {
  accept: 'application/json',
  'x-cg-demo-api-key': API_KEY,
}

/**
 * Fetches coin data by ID
 * @param coinId - The ID of the coin to fetch
 * @returns The coin data
 */
export const getCoinById = async (coinId: string) => {
  const response = await fetch(`${BASE_URL}/coins/${coinId}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch coin data: ${response.status}`)
  }

  return await response.json()
}

/**
 * Searches for coins by name
 * @param searchQuery - The query to search for
 * @returns The search results
 */
export const searchCoins = async (searchQuery: string) => {
  const response = await fetch(`${BASE_URL}/search?query=${searchQuery}`, {
    method: 'GET',
    headers,
  })
  return await response.json()
}

/**
 * @param coinIds - The IDs of the coins to fetch market data for
 * @returns The market data
 */
export const getCoinsMarketData = async (coinIds: string) => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
    {
      method: 'GET',
      headers,
    }
  )
  return await response.json()
}

/**
 * @returns The trending coins
 */
export const getTrendingCoins = async () => {
  const response = await fetch(`${BASE_URL}/search/trending`, {
    method: 'GET',
    headers,
  })
  return await response.json()
}

/**
 * Fetches coin data by page, sort by and sort order
 * @param page - The page number
 * @param sortBy - The field to sort by
 * @param sortOrder - The sort order
 * @returns The coin data
 */
export const getCoinsData = async (
  page: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
) => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=${sortBy}_${sortOrder}&per_page=10&page=${page}`,
    {
      method: 'GET',
      headers,
    }
  )
  return await response.json()
}
