import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getTransakAudUnitPrice } from '@/services/transak/pricing'
import Link from 'next/link'
import Image from 'next/image'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import { getNetProfitLoss } from '@/actions/transactions'

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

  // Get consistent net profit/loss data using the same function as dashboard
  const { netPLAUD, netPLPercent } = await getNetProfitLoss()

  // Get detailed holdings data for display (using same calculation logic as dashboard)
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
    const currentValueAud = unitAud * Number(h.quantity)
    const investedAud = ((h.fiatCurrency || '').toUpperCase() === 'USD' ? usdToAud : 1) * Number(h.totalInvested)
    const plAud = currentValueAud - investedAud
    const plPercent = investedAud > 0 ? (plAud / investedAud) * 100 : 0
    return { ...h, symbol: sym, currentValueAud, investedAud, plAud, plPercent }
  })

  const aud = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })

  // Use consistent totals from the shared calculation
  const totalInvestedAud = holdingsWithPL.reduce((sum, h) => sum + h.investedAud, 0)
  const totalCurrentValueAud = holdingsWithPL.reduce((sum, h) => sum + h.currentValueAud, 0)
  const totalPlAud = netPLAUD // Use consistent value from shared function
  const totalPlPercent = netPLPercent // Use consistent value from shared function

  const getLogoUrl = (symbol: string) =>
    `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${symbol.toLowerCase()}.svg`

  return (
    <>
      <OffWhiteHeadingContainer>
        <div>
          <h1 className="font-light">Holdings</h1>
        </div>
      </OffWhiteHeadingContainer>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 rounded-md border border-gray-100 bg-white p-3">
        <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Total Invested</div>
            <div className="text-lg font-semibold tabular-nums">{aud.format(totalInvestedAud)}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Current Value</div>
            <div className="text-lg font-semibold tabular-nums">{aud.format(totalCurrentValueAud)}</div>
          </div>
          <div className="col-span-2 text-right sm:col-span-2">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Total P/L</div>
            <div className={`text-lg font-semibold tabular-nums ${totalPlAud >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {aud.format(totalPlAud)} ({totalPlPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-gray-100 bg-white">
        <div className="hidden items-center justify-between gap-4 px-3 py-2 text-[11px] text-gray-500 sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr]">
          <span className="pl-10">Asset</span>
          <span className="text-right">Quantity</span>
          <span className="text-right">Invested</span>
          <span className="text-right">P/L</span>
        </div>
        <div className="divide-y divide-gray-100">
          {holdingsWithPL.map((h, idx) => (
            <Link
              key={`${h.symbol}-${h.fiatCurrency}`}
              href={`/holding/${encodeURIComponent(h.symbol)}`}
              className={`grid items-center gap-3 px-3 py-3 transition-colors sm:grid-cols-[1fr_1fr_1fr_1fr] ${idx % 2 === 1 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}
              aria-label={`View ${h.symbol} holding details`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={getLogoUrl(h.symbol)}
                  alt={`${h.symbol} logo`}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full bg-gray-50 ring-1 ring-gray-100"
                  unoptimized
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-500">Asset</span>
                  <span className="text-sm font-medium tracking-wide truncate">{h.symbol}</span>
                </div>
              </div>

              <div className="hidden sm:flex sm:flex-col sm:text-right leading-tight">
                <span className="text-[11px] text-gray-500">Quantity</span>
                <span className="tabular-nums">{h.quantity}</span>
              </div>

              <div className="flex flex-col text-right leading-tight">
                <span className="text-[11px] text-gray-500">Invested</span>
                <span className="tabular-nums">{aud.format(h.investedAud)}</span>
              </div>

              <div className="flex items-end justify-end gap-2 text-right leading-tight">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500">P/L</span>
                  <span className={`${h.plAud >= 0 ? 'text-green-600' : 'text-red-600'} tabular-nums font-medium`}>{aud.format(h.plAud)}</span>
                </div>
                <span
                  className={`inline-flex h-5 items-center justify-center rounded-full border px-1.5 text-[10px] ${
                    h.plAud >= 0 ? 'border-green-100 text-green-700 bg-green-50' : 'border-red-100 text-red-700 bg-red-50'
                  }`}
                >
                  {h.plPercent.toFixed(2)}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-gray-400">
        Prices in AUD. Last update: {new Date(holdings[0].updatedAt).toLocaleString()}
      </div>
      </main>
    </>
  )
}

export default HoldingsPage