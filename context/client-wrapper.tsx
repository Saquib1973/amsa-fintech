import React from 'react'
import AuthProvider from '../components/providers/session-provider'
import { Toaster } from 'react-hot-toast'
import { CoingeckoProvider } from './coingecko-context'
import { Analytics } from '@vercel/analytics/react'
import { GlobalContextProvider } from './global-context'
const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <CoingeckoProvider>
        <GlobalContextProvider>
          <Toaster position="top-center" />
          {children}
          <Analytics />
        </GlobalContextProvider>
      </CoingeckoProvider>
    </AuthProvider>
  )
}

export default ClientWrapper
