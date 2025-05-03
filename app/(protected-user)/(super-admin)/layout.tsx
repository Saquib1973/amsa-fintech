import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ErrorPage from '@/components/error-fallback'
import React from 'react'

const SuperAdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  })
  if (!session || user?.type !== 'SUPER_ADMIN') {
    return <ErrorPage simple />
  }
  return <div>{children}</div>
}

export default SuperAdminLayout
