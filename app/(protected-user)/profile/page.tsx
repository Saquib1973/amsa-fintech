'use client'

import PrimaryButton from '@/components/button/primary-button'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import {
  Camera,
  Edit,
  Mail,
  MapPin,
  Phone,
  X
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  })

  // Sample user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    membershipStatus: 'Premium',
    joinDate: 'January 15, 2023',
    profileImage: '/placeholder-avatar.jpg'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update user data with form data
      // In a real app, you would make an API call here

      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimateWrapper>
      <div className="min-h-screen">
        <OffWhiteHeadingContainer>
          <div className="flex max-md:flex-col justify-between items-center">
            <div>
              <h1 className="text-4xl font-light">Profile</h1>
              <p className="text-xl text-gray-500 mt-2 font-light">
                Manage your account information
              </p>
            </div>
          </div>
        </OffWhiteHeadingContainer>

        <SectionWrapper className="py-6 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
                <div className="p-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
                      <Image
                        height={100}
                        width={100}
                        src={userData.profileImage}
                        alt={userData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-light">{userData.name}</h2>
                  <p className="text-gray-500">{userData.email}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {userData.membershipStatus}
                  </div>
                  <div className="mt-4">
                    {isEditing ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <PrimaryButton
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="text-sm"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </PrimaryButton>
                      </div>
                    ) : (
                      <PrimaryButton
                        onClick={() => setIsEditing(true)}
                        className="text-sm mx-auto"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-100 rounded-md p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-light text-gray-900">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">First Name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Last Name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field w-full pl-10"
                      />
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Phone</span>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field w-full pl-10"
                      />
                      <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Address</span>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field w-full pl-10"
                      />
                      <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">City</span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">State</span>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</span>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Country</span>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </AnimateWrapper>
  )
}