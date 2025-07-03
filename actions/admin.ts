import { getSession } from '@/lib/auth'
import { isSuperAdmin } from './user'
import { prisma } from '@/lib/prisma'
import { User } from '@/types/user'


export const getUsers = async (page: number, rows: number): Promise<{ users: User[]; total: number }> => {
  const session = await getSession()
  if(!(await isSuperAdmin(session?.user.id ?? ''))) {
    throw new Error('Unauthorized')
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * rows,
      take: rows,
    }),
    prisma.user.count(),
  ])

  return { users, total }
}


export const searchUser = async (query: string, page: number, rows: number): Promise<{ users: User[]; total: number }> => {
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

  return { users, total }
}




