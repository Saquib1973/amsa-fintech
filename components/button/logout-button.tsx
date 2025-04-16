'use client'
import React, { useState } from 'react'
import SecondaryButton from './secondary-button'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import Modal from '../modal'
import { cn } from '@/lib/utils'

const LogoutButton = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full relative">
      <SecondaryButton
        className={cn(`w-fit bg-red-500 border-red-800 text-white ${className}`)}
        onClick={() => setOpen(true)}
      >
        Logout
      </SecondaryButton>
      {open && (
        <Modal
          message="Are you sure you want to log out?"
          onSubmit={() => {
            toast.promise(signOut(), {
              loading: 'Logging out...',
              success: 'Logged out successfully',
              error: 'Failed to log out',
            })
          }}
          closeModal={() => setOpen(false)}
        />
      )}
    </div>
  )
}

export default LogoutButton
