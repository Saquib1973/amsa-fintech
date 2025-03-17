'use client'
import React, { useState } from 'react'
import SecondaryButton from './secondary-button'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import Modal from '../modal'

const LogoutButton = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <SecondaryButton
        className="max-w-fit bg-red-500 border-red-800 text-white"
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
    </>
  )
}

export default LogoutButton
