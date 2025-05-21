'use client'
import React from 'react'
import AuthProvider from '../components/providers/session-provider'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import ServiceWorkerUnregister from '@/components/service-worker-unregister'

import { store } from '@/lib/store/store.'
import { Provider } from 'react-redux'
/**
 * ClientWrapper component that sets up the application's context providers
 * and essential services. This component wraps the entire application.
 */
const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {' '}
      {/* Redux provider */}
      <AuthProvider>
        {/* Coingecko provider for cryptocurrency data management
         * Provides access to:
         * - Market data for all coins
         * - Trending coins information
         * - Search functionality for coins
         * - Individual coin details
         */}
        {/* Global context provider for application-wide state
         * Manages:
         * - Theme preferences
         * - Theme toggle functionality
         * - Other global application settings ( to be added )
         */}
        <Toaster position="top-center" />
        {/* Service worker management for PWA functionality */}
        <ServiceWorkerUnregister />
        {children}
        <Analytics />
      </AuthProvider>
    </Provider>
  )
}

export default ClientWrapper
