import { getUsers } from '@/actions/admin'
import React from 'react'

const page = async () => {
  const users = await getUsers(1, 10)
  console.log("USERS", users)
  return (
    <div>page</div>
  )
}

export default page