'use client'

import { DataTable } from '@/components/ui/data-table'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  image: string | null
  type: string
  isVerified: boolean
}

const UserInfo = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        const data = await response.json()
        if (data.user) {
          setUsers(data.user)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name' as const,
      cell: (value: string | number | boolean | null | undefined) =>
        String(value),
    },
    {
      header: 'Email',
      accessorKey: 'email' as const,
      cell: (value: string | number | boolean | null | undefined) =>
        String(value),
    },
    {
      header: 'Type',
      accessorKey: 'type' as const,
      cell: (value: string | number | boolean | null | undefined) =>
        String(value),
    },
    {
      header: 'Verified',
      accessorKey: 'isVerified' as const,
      cell: (value: string | number | boolean | null | undefined) => (
        <span
          className={`px-2 py-1 rounded-full text-xs
        `}
        >
          {value ? 'Verified' : 'Not Verified'}
        </span>
      ),
    },
  ]

  return (
    <AnimateWrapper>
      <SectionWrapper>
        <h1 className="text-5xl font-light mb-8">Users Management</h1>
        <DataTable columns={columns} data={users} isLoading={isLoading} />
      </SectionWrapper>
    </AnimateWrapper>
  )
}

export default UserInfo
