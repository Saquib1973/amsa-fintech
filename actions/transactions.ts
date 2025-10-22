"use server"
import { Transaction } from "@prisma/client"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"



/**
 * Get transactions with pagination support
 * @param params.page - Page number (default: 1)
 * @param params.rows - Number of rows per page (default: 10 if not specified)
 * @param params.recent - If true, returns only the 10 most recent transactions
 * @returns Transaction data with pagination info
 */
export const getTransactions = async (params: {
  page?: number
  rows?: number
  recent?: boolean
} = {}): Promise<{
  data: Transaction[],
  length: number
  numberOfTransactions: number
}> => {
  const session = await getSession()
  const id = session?.user.id

  if (!id) {
    return {
      data: [],
      length: 0,
      numberOfTransactions: 0
    }
  }

  try {
    let transactions: Transaction[]
    const numberOfTransactions = await prisma.transaction.count({ where: { userId: id } })

    if (params.recent) {
      transactions = await prisma.transaction.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
    } else if(params.page) {
      const page = params.page
      const rows = params.rows ?? 10
      const skip = (page - 1) * rows
      const take = rows

      transactions = await prisma.transaction.findMany({
        where: { userId: id },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      })
    }else{
      transactions = await prisma.transaction.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
      })
    }

    return {
      data: transactions,
      length: transactions.length,
      numberOfTransactions
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return {
      data: [],
      length: 0,
      numberOfTransactions: 0
    }
  }
}

export const totalAmountOfTransactions = async (): Promise<number> => {
  const { data } = await getTransactions();
  return data.reduce((acc, tx) => acc + Number(tx.fiatAmount), 0);
}

/**
 * Calculate net profit/loss from holdings
 * @returns Object containing net profit/loss in AUD and percentage
 */
export const getNetProfitLoss = async (): Promise<{
  netPLAUD: number
  netPLPercent: number
  activeAssetsCount: number
}> => {
  const session = await getSession()
  const userId = session?.user.id

  if (!userId) {
    return {
      netPLAUD: 0,
      netPLPercent: 0,
      activeAssetsCount: 0
    }
  }

  try {
    // Fetch holdings from database
    const holdings = await prisma.holding.findMany({
      where: { userId },
      select: {
        symbol: true,
        quantity: true,
        avgBuyPrice: true,
        fiatCurrency: true,
        totalInvested: true,
      },
    })

    if (holdings.length === 0) {
      return {
        netPLAUD: 0,
        netPLPercent: 0,
        activeAssetsCount: 0
      }
    }

    // Get USD to AUD conversion rate if needed
    const needsUsdToAud = holdings.some((h) => h.fiatCurrency?.toUpperCase() === 'USD')
    let usdToAud = 1
    if (needsUsdToAud) {
      try {
        const fxResp = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=AUD', {
          cache: 'no-store',
        })
        const fxJson = (await fxResp.json()) as { rates?: { AUD?: number } }
        usdToAud = fxJson?.rates?.AUD ?? 1
      } catch {
        usdToAud = 1
      }
    }

    // Get unique symbols and fetch current prices
    const uniqueSymbols = Array.from(new Set(holdings.map((h) => h.symbol.toUpperCase())))
    
    // Import the pricing function dynamically to avoid circular dependencies
    const { getTransakAudUnitPrice } = await import('@/services/transak/pricing')
    
    const symbolToUnitPriceAud = Object.fromEntries(
      await Promise.all(
        uniqueSymbols.map(async (sym) => {
          const price = await getTransakAudUnitPrice(sym)
          return [sym, price ?? 0]
        })
      )
    ) as Record<string, number>

    // Calculate profit/loss for each holding
    const holdingsWithPL = holdings.map((h) => {
      const symUpper = h.symbol.toUpperCase()
      const priceAud = symbolToUnitPriceAud[symUpper] ?? 0
      const currentValueAud = priceAud * Number(h.quantity)
      const investedAud = h.fiatCurrency?.toUpperCase() === 'USD' ? Number(h.totalInvested) * usdToAud : Number(h.totalInvested)
      const plAud = currentValueAud - investedAud
      return { plAud, investedAud }
    })

    // Calculate totals
    const netPLAUD = holdingsWithPL.reduce((acc, h) => acc + h.plAud, 0)
    const totalInvestedAUD = holdingsWithPL.reduce((acc, h) => acc + h.investedAud, 0)
    const netPLPercent = totalInvestedAUD > 0 ? (netPLAUD / totalInvestedAUD) * 100 : 0

    return {
      netPLAUD,
      netPLPercent,
      activeAssetsCount: uniqueSymbols.length
    }
  } catch (error) {
    console.error('Error calculating net profit/loss:', error)
    return {
      netPLAUD: 0,
      netPLPercent: 0,
      activeAssetsCount: 0
    }
  }
}