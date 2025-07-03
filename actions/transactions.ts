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
      // For recent transactions, get latest 10
      transactions = await prisma.transaction.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
    } else if(params.page) {
      // For paginated or all transactions
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