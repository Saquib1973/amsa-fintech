'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/button/primary-button'
import TransakSellComponent from '@/components/transak-sell-component'

interface SellHoldingFormProps {
  symbol: string
  maxQuantity: number
  fiatCurrency: string
}

export default function SellHoldingForm({
  symbol,
  maxQuantity,
  fiatCurrency,
}: SellHoldingFormProps) {
  const [quantity, setQuantity] = useState('')
  const [showTransak, setShowTransak] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleQuantitySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const quantityNum = parseFloat(quantity)
    if (!quantityNum || quantityNum <= 0 || quantityNum > maxQuantity) {
      setError('Please enter a valid quantity')
      return
    }

    setError(null)
    setShowTransak(true)
  }

  const handleTransakSuccess = (payload?: unknown) => {
    console.log('Sell successful payload:', payload)
    // Holdings are now adjusted automatically upon transaction completion
    setShowTransak(false)
    router.refresh()
  }

  const handleTransakClose = () => {
    setShowTransak(false)
  }

  const handleTransakError = (err: unknown) => {
    console.error('Sell failed:', err)
    setError('Sell transaction failed. Please try again.')
    setShowTransak(false)
  }

  // Removed manual holding update. Adjustment is handled by transaction APIs.

  if (showTransak) {
    return (
      <div className="py-4">
        <TransakSellComponent
          cryptoCurrency={symbol}
          cryptoAmount={parseFloat(quantity)}
          fiatCurrency={fiatCurrency}
          onSuccess={handleTransakSuccess}
          onClose={handleTransakClose}
          onError={handleTransakError}
        />
        <button
          onClick={() => setShowTransak(false)}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleQuantitySubmit} className="py-4 grid grid-cols-1 gap-3">
      <div className="flex gap-2">
        <input
          id="sell-quantity-input"
          name="quantity"
          type="number"
          step="any"
          min="0"
          max={maxQuantity}
          placeholder={`Max ${maxQuantity}`}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input-field w-full"
          required
        />
        <PrimaryButton
          type="submit"
          className="w-1/3"
          variant="primary"
          size="md"
        >
          Sell
        </PrimaryButton>
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  )
}
