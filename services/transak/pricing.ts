import { URLSearchParams } from 'url'

const TRANSAK_BASE_URL = 'https://api-stg.transak.com/api/v1'

type QuoteResponse = {
  status?: string
  response?: {
    id?: string
    cryptoCurrency?: string
    fiatCurrency?: string
    isBuyOrSell?: 'BUY' | 'SELL'
    network?: string
    paymentMethod?: string
    fiatAmount?: number
    cryptoAmount?: number
  }
}

const DEFAULT_HEADERS: Record<string, string> = {
  accept: 'application/json',
}

const DEFAULT_PARTNER_API_KEY = '2ab57728-cda7-4599-acd2-d230f5d5d31a'

const symbolToDefaultNetwork: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  MATIC: 'polygon',
  POL: 'polygon',
  BNB: 'binance-smart-chain',
  SOL: 'solana',
  AVAX: 'avalanche',
  ARB: 'arbitrum',
  OP: 'optimism',
  TRX: 'tron',
  DOGE: 'dogecoin',
  LTC: 'litecoin',
}

/**
 * Fetches a Transak quote and returns the AUD price per 1 unit of the given crypto.
 * Uses a fiatAmount of 100 AUD by default and derives unit price.
 */
export async function getTransakAudUnitPrice(
  cryptoSymbol: string,
  options?: {
    network?: string
    fiatAmount?: number
    isBuyOrSell?: 'BUY' | 'SELL'
    paymentMethod?: string
    partnerApiKey?: string
  }
): Promise<number | null> {
  const network = options?.network || symbolToDefaultNetwork[cryptoSymbol.toUpperCase()] || 'ethereum'
  const fiatAmount = options?.fiatAmount ?? 100
  const isBuyOrSell = options?.isBuyOrSell ?? 'BUY'
  const paymentMethod = options?.paymentMethod ?? 'credit_debit_card'
  const partnerApiKey = options?.partnerApiKey ?? DEFAULT_PARTNER_API_KEY

  const search = new URLSearchParams({
    partnerApiKey,
    fiatCurrency: 'AUD',
    cryptoCurrency: cryptoSymbol.toUpperCase(),
    isBuyOrSell,
    network,
    paymentMethod,
    fiatAmount: String(fiatAmount),
  })

  const url = `${TRANSAK_BASE_URL}/pricing/public/quotes?${search.toString()}`

  try {
    const res = await fetch(url, { method: 'GET', headers: DEFAULT_HEADERS, cache: 'no-store' })
    if (!res.ok) return null
    const json = (await res.json()) as QuoteResponse
    const cryptoAmount = json?.response?.cryptoAmount
    if (!cryptoAmount || cryptoAmount === 0) return null
    const unitPriceAud = fiatAmount / cryptoAmount
    return unitPriceAud
  } catch {
    return null
  }
}


