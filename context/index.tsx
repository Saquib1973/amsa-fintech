import React from 'react'
import AuthProvider from '../components/providers/session-provider'
import { Toaster } from 'react-hot-toast'
import { CoingeckoProvider } from './coingecko-context'

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <CoingeckoProvider>
        <Toaster position="top-center" />
        {children}
      </CoingeckoProvider>
    </AuthProvider>
  )
}

export default ClientWrapper