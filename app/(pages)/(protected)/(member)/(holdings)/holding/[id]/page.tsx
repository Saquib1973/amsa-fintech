import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getTransakAudUnitPrice } from '@/services/transak/pricing'
import SellHoldingForm from '@/components/(protected-user)/holdings/sell-holding-form'

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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="mb-4 text-2xl font-light tracking-tight">{symbol}</h1>

      <div className="bg-white">
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
            <div
              className={`tabular-nums font-medium ${plAud >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {aud.format(plAud)} ({plPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <SellHoldingForm
          symbol={symbol}
          maxQuantity={holding.quantity}
          fiatCurrency={(holding.fiatCurrency || 'USD').toUpperCase()}
        />
      </div>

      <div className="mt-3 text-[11px] text-gray-400">
        Prices in AUD. Last update:{' '}
        {new Date(holding.updatedAt).toLocaleString()}
      </div>
    </div>
  )
}
