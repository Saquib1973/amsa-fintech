import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getSession()
  const userId = session?.user.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contentType = req.headers.get('content-type') || ''
    let symbol: string | undefined
    let fiatCurrency: string | undefined
    let quantity: number | undefined

    if (contentType.includes('application/json')) {
      const body = (await req.json()) as {
        symbol?: string
        fiatCurrency?: string
        quantity?: number
      }
      symbol = body.symbol
      fiatCurrency = body.fiatCurrency
      quantity = body.quantity
    } else {
      const form = await req.formData()
      symbol = (form.get('symbol') as string) || undefined
      fiatCurrency = (form.get('fiatCurrency') as string) || undefined
      const q = form.get('quantity') as string | null
      quantity = q != null ? Number(q) : undefined
    }

    if (!symbol || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const currency = (fiatCurrency || 'USD').toUpperCase()

    const updated = await prisma.$transaction(async (tx) => {
      const holding = await tx.holding.findUnique({
        where: {
          userId_symbol_fiatCurrency: { userId, symbol, fiatCurrency: currency },
        },
      })

      if (!holding) {
        throw new Error('Holding not found')
      }

      if (quantity > holding.quantity) {
        throw new Error('Sell quantity exceeds holding')
      }

      const newQuantity = holding.quantity - quantity
      const reduceInvestedBy = holding.avgBuyPrice * quantity
      const newTotalInvested = Math.max(0, holding.totalInvested - reduceInvestedBy)

      if (newQuantity === 0) {
        await tx.holding.delete({
          where: { userId_symbol_fiatCurrency: { userId, symbol, fiatCurrency: currency } },
        })
        return { ...holding, quantity: 0, totalInvested: 0 }
      }

      const updatedHolding = await tx.holding.update({
        where: { userId_symbol_fiatCurrency: { userId, symbol, fiatCurrency: currency } },
        data: {
          quantity: newQuantity,
          totalInvested: newTotalInvested,
          // Keep avgBuyPrice unchanged for remaining units
        },
      })

      return updatedHolding
    })

    return NextResponse.json({ holding: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    const status = message === 'Holding not found' || message === 'Sell quantity exceeds holding' ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}


