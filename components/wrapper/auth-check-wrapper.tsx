'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '../loader-component'

export default function AuthCheckWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col bg-white dark:bg-black items-center justify-center min-h-screen">
        <Loader message="Verifying your session..." />
      </div>
    )
  }

  if (status === 'authenticated') {
    return <>{children}</>
  }

  return null
}
