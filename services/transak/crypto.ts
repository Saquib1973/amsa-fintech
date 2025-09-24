import { TRANSAK_CRYPTOCOVERAGE_BASE_URL } from '@/lib/transak'
import type {
  TransakCryptoCurrenciesResponse,
  TransakCryptoCurrency,
} from '@/types/transak'

export async function getCryptoCurrencies(): Promise<TransakCryptoCurrency[]> {
  const res = await fetch(
    `${TRANSAK_CRYPTOCOVERAGE_BASE_URL}/crypto-currencies`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch Transak crypto currencies: ${res.status}`)
  }

  const json = (await res.json()) as TransakCryptoCurrenciesResponse
  return json.response || []
}


