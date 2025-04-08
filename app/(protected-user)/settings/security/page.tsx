'use client'

import PrimaryButton from '@/components/button/primary-button'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import {
  Check,
  Clock,
  Eye,
  EyeOff,
  Lock,
  X
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loginHistory = [
    {
      id: 1,
      location: 'New York, USA',
      device: 'Chrome on Windows',
      date: '2023-04-01T10:30:00',
      status: 'current'
    },
    {
      id: 2,
      location: 'Los Angeles, USA',
      device: 'Safari on iPhone',
      date: '2023-03-28T15:45:00',
      status: 'active'
    },
    {
      id: 3,
      location: 'Chicago, USA',
      device: 'Firefox on Mac',
      date: '2023-03-15T09:20:00',
      status: 'active'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      // Clear form fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      toast.success('Password updated successfully')
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimateWrapper>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <OffWhiteHeadingContainer>
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
              <h1 className="text-4xl font-light">Security Settings</h1>
              <p className="text-xl text-gray-500 mt-2 font-light">
                Manage your account security
              </p>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="py-6 md:py-16">
          <div className="space-y-12">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-light">Change Password</h2>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="input-field w-full"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      type="button"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="input-field w-full"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      type="button"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="input-field w-full"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <PrimaryButton
                  className="w-full"
                  onClick={handlePasswordUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </PrimaryButton>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-light">Login History</h2>
              </div>

              <div className="space-y-3">
                {loginHistory.map((login) => (
                  <div key={login.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 rounded-md">
                    <div>
                      <p className="font-medium">{login.location}</p>
                      <p className="text-sm text-gray-500">{login.device}</p>
                      <p className="text-sm text-gray-500">{formatDate(login.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {login.status === 'current' ? (
                        <span className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Current Session
                        </span>
                      ) : (
                        <button className="text-red-600 dark:text-red-400 text-sm hover:underline flex items-center">
                          <X className="w-4 h-4 mr-1" /> Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}