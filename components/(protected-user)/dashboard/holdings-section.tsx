import Image from 'next/image'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTransakAudUnitPrice } from '@/services/transak/pricing'
import { TrendingDown, TrendingUp } from 'lucide-react'

type HoldingRow = {
  symbol: string
  quantity: number
  avgBuyPrice: number
  fiatCurrency: string
  totalInvested: number
}

type HoldingWithPL = HoldingRow & {
  plAud: number
  plPercent: number
  investedAud: number
  currentValueAud: number
}

const audFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 2,
})

async function fetchUsdToAudRate(): Promise<number> {
  try {
    const fxResp = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=AUD', {
      cache: 'no-store',
    })
    const fxJson = (await fxResp.json()) as { rates?: { AUD?: number } }
    return fxJson?.rates?.AUD ?? 1
  } catch {
    return 1
  }
}

export default async function HoldingsSection() {
  const session = await getSession()
  const userId = session?.user.id

  if (!userId) return null

  const holdings: HoldingRow[] = await prisma.holding.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      symbol: true,
      quantity: true,
      avgBuyPrice: true,
      fiatCurrency: true,
      totalInvested: true,
    },
  })

  if (holdings.length === 0) return null

  const needsUsdToAud = holdings.some((h) => h.fiatCurrency?.toUpperCase() === 'USD')
  const usdToAud = needsUsdToAud ? await fetchUsdToAudRate() : 1

  const uniqueSymbols = Array.from(new Set(holdings.map((h) => h.symbol.toUpperCase())))

  // Fetch CoinGecko logo URLs for symbols
  const symbolToLogoUrl: Record<string, string | undefined> = {}
  await Promise.all(
    uniqueSymbols.map(async (sym) => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(sym)}`, {
          method: 'GET',
          headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY ?? '' },
          cache: 'no-store',
        })
        const json = (await res.json()) as { coins?: Array<{ id?: string; symbol?: string; thumb?: string; large?: string }> }
        const match = json?.coins?.find((c) => (c.symbol || '').toUpperCase() === sym)
        if (match) symbolToLogoUrl[sym] = match.thumb || match.large
      } catch {
      }
    })
  )

  // Fetch Transak AUD unit prices per symbol
  const symbolToUnitPriceAud = Object.fromEntries(
    await Promise.all(
      uniqueSymbols.map(async (sym) => {
        const price = await getTransakAudUnitPrice(sym)
        return [sym, price ?? 0]
      })
    )
  ) as Record<string, number>

  const holdingsWithPL: HoldingWithPL[] = holdings.map((h) => {
    const symUpper = h.symbol.toUpperCase()
    const priceAud = symbolToUnitPriceAud[symUpper] ?? 0
    const currentValueAud = priceAud * Number(h.quantity)
    const investedAud = h.fiatCurrency?.toUpperCase() === 'USD' ? Number(h.totalInvested) * usdToAud : Number(h.totalInvested)
    const plAud = currentValueAud - investedAud
    const plPercent = investedAud > 0 ? (plAud / investedAud) * 100 : 0
    return { ...h, plAud, plPercent, investedAud, currentValueAud }
  })

  const netPLAUD = holdingsWithPL.reduce((acc, h) => acc + h.plAud, 0)
  const totalInvestedAUD = holdingsWithPL.reduce((acc, h) => acc + h.investedAud, 0)
  const netPLPercent = totalInvestedAUD > 0 ? (netPLAUD / totalInvestedAUD) * 100 : 0
  const isNetPositive = netPLAUD >= 0
  const netDotClass = isNetPositive ? 'bg-green-500' : 'bg-red-500'
  const NetIcon = isNetPositive ? TrendingUp : TrendingDown

  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-primary-main rounded-t-md text-white">
        <h2 className="text-xl">Your Holdings</h2>
        <div className="flex items-center gap-2 text-sm px-2 py-1 text-white">
          <span className={`inline-block animate-pulse w-2 h-2 rounded-full ${netDotClass}`} />
          <span className="tabular-nums">
            {isNetPositive ? '+' : '-'}{audFormatter.format(Math.abs(netPLAUD))} ({netPLPercent.toFixed(2)}%)
          </span>
          <span className="font-medium">
            <NetIcon className="size-4" />
          </span>
        </div>
      </div>
      <div className="p-4 px-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pl-4 font-normal">Asset</th>
              <th className="py-2 px-3 font-normal">Quantity</th>
              <th className="py-2 px-3 font-normal">Profit/Loss</th>
              <th className="py-2 pl-3 font-normal">Invested</th>
            </tr>
          </thead>
          <tbody>
            {holdingsWithPL.map((h) => {
              const isPositive = h.plAud >= 0
              const plClass = isPositive ? 'text-green-600' : 'text-red-600'
              const sign = isPositive ? '+' : '-'
              const symUpper = h.symbol.toUpperCase()
              const logo = symbolToLogoUrl[symUpper]
              return (
                <tr key={`${h.symbol}-${h.fiatCurrency}`} className="border-b last:border-b-0">
                  <td className="py-2 px-3">
                    <Link href={`/holding/${symUpper}`} className="flex items-center gap-2 hover:text-primary-main transition-colors">
                      {logo ? (
                        <Image src={logo} alt={h.symbol} width={20} height={20} className="rounded-full" unoptimized />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-200" />
                      )}
                      <span>{h.symbol}</span>
                      <span className="text-gray-400">({h.fiatCurrency})</span>
                    </Link>
                  </td>
                  <td className="py-2 px-3">{h.quantity}</td>
                  <td className={`py-2 px-3 tabular-nums ${plClass}`}>
                    {sign}{audFormatter.format(Math.abs(h.plAud))} ({h.plPercent.toFixed(2)}%)
                  </td>
                  <td className="py-2 pl-3">{Number(h.totalInvested).toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}


