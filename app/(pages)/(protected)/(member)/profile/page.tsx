'use client'

import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import { Camera, Edit, Mail, MapPin, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const getUserInformation = async () => {
    const response = await fetch('/api/user/information')
    const data = await response.json()
    setFormData({
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      address: data.user.addresses?.address,
      city: data.user.addresses?.city,
      state: data.user.addresses?.state,
      zip: data.user.addresses?.zip,
      country: data.user.addresses?.country,
      image: data.user.image,
    })
    return data
  }
  const updateUserInformation = async () => {
    const response = await fetch('/api/user/information', {
      method: 'PATCH',
      body: JSON.stringify({
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      }),
    })
    const data = await response.json()
    toast.success(data.message)
    getUserInformation()
  }
  useEffect(() => {
    getUserInformation()
  }, [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    image: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      await updateUserInformation()
      setIsEditing(false)
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
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
                <div className="p-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-30 h-30 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 mx-auto">
                      <Image
                        height={100}
                        width={100}
                        src={formData.image}
                        alt={formData.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-light">{formData.name}</h2>
                  <p className="text-gray-500">{formData.email}</p>
                  <div className="mt-4">
                    {isEditing ? (
                      <div className="flex gap-2 justify-center">
                        <SecondaryButton
                          onClick={() => setIsEditing(false)}
                          className=""
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </SecondaryButton>
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
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-md p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-light dark:text-white">
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </span>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true}
                        className="input-field w-full pl-10"
                      />
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field w-full pl-10"
                      />
                      <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </span>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </span>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter your state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </span>
                    <input
                      type="text"
                      name="zip"
                      placeholder="Enter your zip code"
                      value={formData.zip}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </span>
                    <input
                      type="text"
                      name="country"
                      placeholder="Enter your country"
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
