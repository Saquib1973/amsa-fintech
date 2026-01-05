import { getSession } from '@/lib/auth'
import { isSuperAdmin } from './user'
import { prisma } from '@/lib/prisma'
import { User } from '@/types/user'


export const getUsers = async (page: number, rows: number): Promise<{ users: any[]; total: number }> => {
  const session = await getSession()
  if(!(await isSuperAdmin(session?.user.id ?? ''))) {
    throw new Error('Unauthorized')
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * rows,
      take: rows,
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    }),
    prisma.user.count(),
  ])

  // Calculate total spent and received for each user
  const usersWithMetrics = await Promise.all(
    users.map(async (user) => {
      const transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        select: { 
          isBuyOrSell: true, 
          cryptoAmount: true,
          fiatAmount: true 
        }
      })
      
      const totalSpent = transactions
        .filter(t => t.isBuyOrSell === 'BUY')
        .reduce((sum, t) => sum + (t.fiatAmount || 0), 0)
      
      const totalReceived = transactions
        .filter(t => t.isBuyOrSell === 'SELL')
        .reduce((sum, t) => sum + (t.fiatAmount || 0), 0)
      
      return {
        ...user,
        totalSpent,
        totalReceived
      }
    })
  )

  return { users: usersWithMetrics, total }
}


export const searchUser = async (query: string, page: number, rows: number): Promise<{ users: any[]; total: number }> => {
  const session = await getSession()
  if (!(await isSuperAdmin(session?.user.id ?? ''))) {
    throw new Error('Unauthorized')
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip: (page - 1) * rows,
      take: rows,
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    }),
    prisma.user.count({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    }),
  ])

  // Calculate total spent and received for each user
  const usersWithMetrics = await Promise.all(
    users.map(async (user) => {
      const transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        select: { 
          isBuyOrSell: true, 
          cryptoAmount: true,
          fiatAmount: true 
        }
      })
      
      const totalSpent = transactions
        .filter(t => t.isBuyOrSell === 'BUY')
        .reduce((sum, t) => sum + (t.fiatAmount || 0), 0)
      
      const totalReceived = transactions
        .filter(t => t.isBuyOrSell === 'SELL')
        .reduce((sum, t) => sum + (t.fiatAmount || 0), 0)
      
      return {
        ...user,
        totalSpent,
        totalReceived
      }
    })
  )

  return { users: usersWithMetrics, total }
}

