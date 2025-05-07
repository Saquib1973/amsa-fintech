"use client"
import React, { useEffect, useRef, useState } from 'react'
import { User, Lock, Settings, LogOut, ChevronDown } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const UserOptions = () => {
  const [isOpen, setIsOpen] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    setIsOpen(false)
    toast.promise(signOut(), {
      loading: 'Logging out...',
      success: 'Logged out successfully',
      error: 'Failed to log out',
    })
  }
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])


  return (
    <div className="relative" ref={optionsRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 hover:border-gray-100 bg-gray-50 rounded-lg transition-colors"
      >
        <User className="w-5 h-5" />
        <span>Account</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 z-50">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <Link
            href="/settings/security"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Lock className="w-4 h-4" />
            Security
          </Link>
          <Link
            href="/settings/preferences"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Preferences
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserOptions
