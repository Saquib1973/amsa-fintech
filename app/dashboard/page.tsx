import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import LogoutButton from '@/components/button/logout-button'
export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl">Dashboard</h1>
        {session && <LogoutButton />}
      </div>
      {session ? (
        <p>Welcome, {session.user?.email}</p>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  )
}
