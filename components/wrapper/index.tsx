import React from 'react'
import AuthProvider from '../providers/session-provider'
import { Toaster } from 'react-hot-toast'

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      {children}
    </AuthProvider>
  )
}

export default ClientWrapper