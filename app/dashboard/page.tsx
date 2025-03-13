import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div className="p-6">
      <h1 className="text-2xl">Dashboard</h1>
      {session ? (
        <p>Welcome, {session.user?.email}</p>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  )
}
