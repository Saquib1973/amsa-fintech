import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getTransakAudUnitPrice } from '@/services/transak/pricing'
import SellHoldingForm from '@/components/(protected-user)/holdings/sell-holding-form'
import Image from 'next/image'
import { getCryptoCurrencies } from '@/services/transak/crypto'

async function fetchUsdToAudRate(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.exchangerate.host/latest?base=USD&symbols=AUD',
      { cache: 'no-store' }
    )
    const json = (await res.json()) as { rates?: { AUD?: number } }
    return json?.rates?.AUD ?? 1
  } catch {
    return 1
  }
}

async function fetchCoinMetaBySymbol(symbol: string): Promise<{ id?: string; name?: string; imageUrl?: string } | null> {
  const upper = (symbol || '').toUpperCase()
  if (!upper) return null
  // Try CoinGecko search first
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(upper)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY ?? '',
        },
        cache: 'no-store',
      }
    )
    const json = (await res.json()) as {
      coins?: Array<{ id?: string; name?: string; symbol?: string; thumb?: string; large?: string }>
    }
    const match = json?.coins?.find((c) => (c.symbol || '').toUpperCase() === upper)
    if (match) {
      return { id: match.id, name: match.name, imageUrl: match.thumb || match.large }
    }
  } catch {
    // ignore and try Transak fallback
  }

  // Fallback to Transak crypto list
  try {
    const all = await getCryptoCurrencies()
    const m = all.find((c) => (c.symbol || '').toUpperCase() === upper)
    if (m) {
      const img = m.image?.small || m.image?.thumb || m.image?.large
      return { name: m.name, imageUrl: img }
    }
  } catch {
    // ignore
  }

  return null
}

async function fetchCoinMarketDataById(id: string | undefined) {
  if (!id) return null
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&ids=${encodeURIComponent(id)}&precision=2`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY ?? '',
        },
        cache: 'no-store',
      }
    )
    const json = (await res.json()) as Array<{
      current_price?: number
      price_change_percentage_24h?: number
      market_cap?: number
      total_volume?: number
      market_cap_rank?: number
    }>
    return Array.isArray(json) && json.length > 0 ? json[0] : null
  } catch {
    return null
  }
}

export default async function HoldingPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params
  const symbol = (id || '').toUpperCase()

  const session = await getSession()
  const userId = session?.user.id
  if (!userId || !symbol) return null

  const holding = await prisma.holding.findFirst({
    where: { userId, symbol },
    orderBy: { updatedAt: 'desc' },
  })

  if (!holding) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center text-gray-500">Holding not found.</div>
      </div>
    )
  }

  const unitAud = (await getTransakAudUnitPrice(symbol)) ?? 0
  const meta = await fetchCoinMetaBySymbol(symbol)
  const market = await fetchCoinMarketDataById(meta?.id)
  const usdToAud =
    (holding.fiatCurrency || '').toUpperCase() === 'USD'
      ? await fetchUsdToAudRate()
      : 1
  const investedAud = usdToAud * holding.totalInvested
  const currentValueAud = unitAud * holding.quantity
  const plAud = currentValueAud - investedAud
  const plPercent = investedAud > 0 ? (plAud / investedAud) * 100 : 0

  const aud = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {meta?.imageUrl ? (
            <Image
              src={meta.imageUrl}
              alt={meta?.name || symbol}
              width={48}
              height={48}
              className="rounded-full h-12 w-12"
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-light tracking-tight flex items-center gap-2">
              <span>{meta?.name || symbol}</span>
              <span className="text-gray-600 text-sm bg-gray-100 rounded px-2 py-0.5">{symbol}</span>
            </h1>
            <div className="text-[11px] text-gray-400">Prices in AUD. Last update {new Date(holding.updatedAt).toLocaleString()}</div>
          </div>
        </div>
        {market ? (
          <div className="text-right">
            <div className="text-sm text-gray-500">Price</div>
            <div className="text-2xl tabular-nums">{aud.format(market.current_price ?? 0)}</div>
            <div className={`inline-flex mt-1 text-xs rounded-full px-2 py-0.5 ${((market.price_change_percentage_24h ?? 0) >= 0) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {(market.price_change_percentage_24h ?? 0).toFixed(2)}%
            </div>
          </div>
        ) : null}
      </div>

      {/* Details vs User Standings vs Sell */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Market Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Market Details</h2>
            {market ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Price (AUD)</div>
                  <div className="tabular-nums">{aud.format(market.current_price ?? 0)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">24h Change</div>
                  <div className={`tabular-nums ${((market.price_change_percentage_24h ?? 0) >= 0) ? 'text-green-600' : 'text-red-600'}`}>
                    {(market.price_change_percentage_24h ?? 0).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Rank</div>
                  <div className="tabular-nums">#{market.market_cap_rank ?? '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Market Cap</div>
                  <div className="tabular-nums">{aud.format(market.market_cap ?? 0)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">24h Volume</div>
                  <div className="tabular-nums">{aud.format(market.total_volume ?? 0)}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No market data available.</div>
            )}
          </div>
        </div>

        {/* Right rail: Your Position and Sell */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg border p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Your Position</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Quantity</div>
                <div className="tabular-nums">{holding.quantity}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Invested (AUD)</div>
                <div className="tabular-nums">{aud.format(investedAud)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Current Value (AUD)</div>
                <div className="tabular-nums">{aud.format(currentValueAud)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Profit / Loss</div>
                <div className={`tabular-nums font-medium ${plAud >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {aud.format(plAud)} ({plPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Sell</h2>
            <SellHoldingForm
              symbol={symbol}
              maxQuantity={holding.quantity}
              fiatCurrency={(holding.fiatCurrency || 'USD').toUpperCase()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
