import Link from 'next/link'
import { ChevronRight, User } from 'lucide-react'

type RecentUser = {
  id: string
  name: string | null
  email: string | null
  type: string
  isVerified: boolean
}

interface RecentUsersSectionProps {
  users: RecentUser[]
}

const UserIcon = ({ name }: { name: string | null }) => (
  <div className="w-8 h-8 rounded-full border border-gray-200 bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-medium">
    {name ? name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
  </div>
)

const RecentUserItem = ({ user }: { user: RecentUser }) => {
  return (
    <Link
      href={`/user/${user.id}`}
      className="flex items-center justify-between w-full border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer px-4 py-3 group"
    >
      <div className="flex items-center gap-2 min-w-[40px]">
        <UserIcon name={user.name} />
      </div>
      <div className="flex-1 min-w-0 px-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-800 text-sm group-hover:underline group-hover:text-blue-600 transition-colors duration-100">
            {user.name || 'No Name'}
          </span>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
            user.type === 'SUPER_ADMIN' 
              ? 'bg-purple-100 text-purple-800'
              : user.type === 'ADMIN'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {user.type}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {user.email}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 min-w-[90px]">
        <span className={`text-xs px-2 py-1 rounded-full ${
          user.isVerified 
            ? 'bg-green-100 text-green-800' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {user.isVerified ? 'Verified' : 'Pending'}
        </span>
      </div>
      <div className="flex items-center ml-2">
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-transform duration-150 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

export default function RecentUsersSection({ users }: RecentUsersSectionProps) {
  return (
    <div className="bg-white rounded-md border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-primary-main rounded-t-md text-white">
        <h2 className="text-xl">Recent Users</h2>
      </div>
      <div className="">
        {users.length > 0 ? (
          <div className="">
            {users.map((user) => (
              <RecentUserItem key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No users found</p>
          </div>
        )}
      </div>
      <Link
        href="/users"
        className="flex w-full items-center hover:text-primary-main hover:bg-gray-50 justify-center gap-2 rounded-b-md px-4 py-4 text-sm font-medium transition-colors group border-t border-gray-100"
      >
        <span>View all users</span>
        <ChevronRight className="h-4 w-4 group-hover:text-primary-main transition-all group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
