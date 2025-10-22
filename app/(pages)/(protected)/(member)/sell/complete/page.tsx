'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function SellCompletePage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  console.log(isProcessing)

  useEffect(() => {
    const processSellOrder = async () => {
      try {
        // Extract order details from URL parameters
        // Transak appends these as query parameters when redirecting
        const orderId = searchParams.get('orderId') || searchParams.get('id')
        const cryptoAmount = searchParams.get('cryptoAmount') || searchParams.get('amount')
        const cryptoCurrency = searchParams.get('cryptoCurrency') || searchParams.get('currency')
        const walletAddress = searchParams.get('walletAddress') || searchParams.get('address')
        const network = searchParams.get('network') || 'polygon' // Default to polygon

        console.log('URL parameters:', {
          orderId,
          cryptoAmount,
          cryptoCurrency,
          walletAddress,
          network,
          allParams: Object.fromEntries(searchParams.entries())
        })

        // Check for undefined string values and handle them
        if (cryptoAmount === 'undefined' || cryptoCurrency === 'undefined' || walletAddress === 'undefined' || network === 'undefined') {
          throw new Error(`Invalid parameters received. Some values are undefined: cryptoAmount=${cryptoAmount}, cryptoCurrency=${cryptoCurrency}, walletAddress=${walletAddress}, network=${network}`)
        }

        if (!orderId || !cryptoAmount || !cryptoCurrency || !walletAddress) {
          throw new Error(`Missing required order parameters. Received: orderId=${orderId}, cryptoAmount=${cryptoAmount}, cryptoCurrency=${cryptoCurrency}, walletAddress=${walletAddress}`)
        }

        // Call your backend to initiate the crypto transfer
        const response = await fetch('/api/sell/transfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            cryptoAmount: parseFloat(cryptoAmount),
            cryptoCurrency,
            walletAddress,
            network,
            userId: session?.user?.id,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to process sell order')
        }

        const result = await response.json()
        console.log('Sell order processed:', result)
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push('/holdings')
        }, 5000)

      } catch (err) {
        console.error('Error processing sell order:', err)
        setError(err instanceof Error ? err.message : 'Failed to process sell order')
        setIsProcessing(false)
      }
    }

    if (session?.user?.id) {
      processSellOrder()
    }
  }, [searchParams, session?.user?.id])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.href = '/holdings'}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Holdings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Processing Your Sell Order</h1>
        <p className="text-gray-600">Please wait while we transfer your crypto from our custodial wallet...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few moments to complete.</p>
      </div>
    </div>
  )
}