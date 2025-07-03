import { prisma } from '@/lib/prisma'
import { User } from '@/types/user'

export const getUserById = async (id: string): Promise<User> => {
  if (!id) {
    throw new Error('User ID is required')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        type: true,
        isVerified: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    throw error
  }
}

export const isSuperAdmin = async (id: string): Promise<boolean> => {
  const user = await getUserById(id);
  return user.type === 'SUPER_ADMIN';
}