
const API_KEY = 'CG-1Ms2BtmhRRJT4dAEvyFt1Ldi'
const BASE_URL = 'https://api.coingecko.com/api/v3'

const headers = {
  accept: 'application/json',
  'x-cg-demo-api-key': API_KEY,
}

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

export const searchCoins = async (searchQuery: string) => {
  const response = await fetch(`${BASE_URL}/search?query=${searchQuery}`, {
    method: 'GET',
    headers,
  })
  return await response.json()
}

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

export const getTrendingCoins = async () => {
  const response = await fetch(`${BASE_URL}/search/trending`, {
    method: 'GET',
    headers,
  })
  return await response.json()
}

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
