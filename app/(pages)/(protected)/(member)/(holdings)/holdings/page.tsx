import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getTransakAudUnitPrice } from '@/services/transak/pricing'
import Link from 'next/link'

async function fetchUsdToAudRate(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=AUD', { cache: 'no-store' })
    const json = (await res.json()) as { rates?: { AUD?: number } }
    return json?.rates?.AUD ?? 1
  } catch {
    return 1
  }
}

const HoldingsPage = async () => {
  const session = await getSession()
  const userId = session?.user.id

  if (!userId) return null

  const holdings = await prisma.holding.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      symbol: true,
      quantity: true,
      avgBuyPrice: true,
      fiatCurrency: true,
      totalInvested: true,
      updatedAt: true,
    },
  })

  if (!holdings || holdings.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center text-gray-500">No holdings yet.</div>
      </div>
    )
  }

  const needsUsdToAud = holdings.some((h) => (h.fiatCurrency || '').toUpperCase() === 'USD')
  const usdToAud = needsUsdToAud ? await fetchUsdToAudRate() : 1

  const uniqueSymbols = Array.from(new Set(holdings.map((h) => h.symbol.toUpperCase())))
  const symbolToUnitPriceAud = Object.fromEntries(
    await Promise.all(
      uniqueSymbols.map(async (sym) => {
        const price = await getTransakAudUnitPrice(sym)
        return [sym, price ?? 0]
      })
    )
  ) as Record<string, number>

  const holdingsWithPL = holdings.map((h) => {
    const sym = h.symbol.toUpperCase()
    const unitAud = symbolToUnitPriceAud[sym] ?? 0
    const currentValueAud = unitAud * h.quantity
    const investedAud = ((h.fiatCurrency || '').toUpperCase() === 'USD' ? usdToAud : 1) * h.totalInvested
    const plAud = currentValueAud - investedAud
    const plPercent = investedAud > 0 ? (plAud / investedAud) * 100 : 0
    return { ...h, symbol: sym, currentValueAud, investedAud, plAud, plPercent }
  })

  const aud = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-light tracking-tight">Holdings</h1>
        <p className="text-sm text-gray-500">A simple overview of your assets.</p>
      </div>

      <div className="divide-y divide-gray-100 bg-white">
        {holdingsWithPL.map((h) => (
          <Link
            key={`${h.symbol}-${h.fiatCurrency}`}
            href={`/holding/${encodeURIComponent(h.symbol)}`}
            className="flex items-start justify-between gap-4 p-4 hover:bg-gray-50 transition-colors"
            aria-label={`View ${h.symbol} holding details`}
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Asset</span>
              <span className="text-base font-medium tracking-wide">{h.symbol}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm text-gray-500">Quantity</span>
              <span className="tabular-nums">{h.quantity}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm text-gray-500">Profit / Loss</span>
              <span className={`${h.plAud >= 0 ? 'text-green-600' : 'text-red-600'} tabular-nums font-medium`}>
                {aud.format(h.plAud)} ({h.plPercent.toFixed(2)}%)
              </span>
            </div>
            <div className="hidden sm:flex sm:flex-col sm:text-right">
              <span className="text-sm text-gray-500">Invested (AUD)</span>
              <span className="tabular-nums">{aud.format(h.investedAud)}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 text-[11px] text-gray-400">Prices in AUD. Last update: {new Date(holdings[0].updatedAt).toLocaleString()}</div>
    </div>
  )
}

export default HoldingsPage