import React from 'react'
import AuthProvider from '../components/providers/session-provider'
import { Toaster } from 'react-hot-toast'
import { CoingeckoProvider } from './coingecko-context'
import { Analytics } from '@vercel/analytics/react'
import { GlobalContextProvider } from './global-context'
import ServiceWorkerUnregister from '@/components/service-worker-unregister'

/**
 * ClientWrapper component that sets up the application's context providers
 * and essential services. This component wraps the entire application.
 */
const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {/* Coingecko provider for cryptocurrency data management
       * Provides access to:
       * - Market data for all coins
       * - Trending coins information
       * - Search functionality for coins
       * - Individual coin details
       */}
      <CoingeckoProvider>
        {/* Global context provider for application-wide state
         * Manages:
         * - Theme preferences
         * - Theme toggle functionality
         * - Other global application settings ( to be added )
         */}
        <GlobalContextProvider>
          <Toaster position="top-center" />
          {/* Service worker management for PWA functionality */}
          <ServiceWorkerUnregister />
          {children}
          <Analytics />
        </GlobalContextProvider>
      </CoingeckoProvider>
    </AuthProvider>
  )
}

export default ClientWrapper
