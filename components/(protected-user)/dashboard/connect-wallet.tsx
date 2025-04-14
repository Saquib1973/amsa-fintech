'use client'
import { ethers } from 'ethers'
import { useState } from 'react'
import SecondaryButton from '../../button/secondary-button'
import toast from 'react-hot-toast'
import Modal from '@/components/modal'

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider
  }
}

export default function ConnectWallet() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set())

  const connectWallet = async () => {
    try {
      setIsConnecting(true)

      if (!window.ethereum) {
        toast.error('Please install MetaMask or another Web3 wallet')
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const toastId = toast.loading('Connecting to wallet...')

      if (!window.ethereum.request) {
        toast.error('Your wallet does not support the required methods', { id: toastId })
        return
      }

      // Request permissions first
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })

      // Get all accounts with their correct case
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[]

      // Get the correct case for each account by getting its public key
      const accountsWithCase = await Promise.all(accounts.map(async (account) => {
        try {
          // Get the signer for this account
          const signer = provider.getSigner(account)
          // Get the address from the signer which will have the correct case
          const address = await signer.getAddress()
          return address
        } catch (error) {
          console.error('Error getting address case:', error)
          return account // Fallback to the original address if we can't get the case
        }
      }))

      if (accountsWithCase.length > 1) {
        setAvailableAccounts(accountsWithCase)
        // Automatically select all accounts
        setSelectedAccounts(new Set(accountsWithCase))
        setShowAccountModal(true)
        toast.dismiss(toastId)
        return
      }

      // Handle single wallet connection
      const result = await connectAccount(accountsWithCase[0], provider)
      if (result.success) {
        toast.success('Wallet connected successfully!', { id: toastId })
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to connect wallet', { id: toastId })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      toast.error(errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectAccount = async (address: string, provider: ethers.providers.Web3Provider) => {
    try {
      const message = 'Sign to get your public key'
      // Get the specific signer for this address
      const signer = provider.getSigner(address)
      const signature = await signer.signMessage(message)

      const messageHash = ethers.utils.hashMessage(message)
      const pubKey = ethers.utils.recoverPublicKey(messageHash, signature)

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          pubKey,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        // If wallet already exists, consider it a success
        if (data.error?.includes('already exists')) {
          return { address, success: true }
        }
        throw new Error(data.error || 'Failed to connect wallet')
      }

      return { address, success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      return { address, success: false, error: errorMessage }
    }
  }

  const handleAccountSelect = async () => {
    if (selectedAccounts.size === 0) return

    try {
      setIsConnecting(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum!)
      const toastId = toast.loading('Connecting wallets...')

      // Connect all selected accounts in parallel
      const accountsToConnect = Array.from(selectedAccounts)
      const results = await Promise.all(
        accountsToConnect.map(address => connectAccount(address, provider))
      )

      // Check for any failures
      const failures = results.filter(result => !result.success)
      if (failures.length > 0) {
        const errorMessages = failures.map(f => `${f.address}: ${f.error}`).join('\n')
        toast.error(`Failed to connect some wallets:\n${errorMessages}`, { id: toastId })
        return
      }

      toast.success('All wallets connected successfully!', { id: toastId })
      setShowAccountModal(false)
      window.location.reload()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      toast.error(errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const toggleAccount = (address: string) => {
    const newSelectedAccounts = new Set(selectedAccounts)
    if (newSelectedAccounts.has(address)) {
      newSelectedAccounts.delete(address)
    } else {
      newSelectedAccounts.add(address)
    }
    setSelectedAccounts(newSelectedAccounts)
  }

  const accountList = availableAccounts.map((address) => (
    <label
      key={address}
      className="flex items-center p-2 cursor-pointer"
    >
      <input
        type="checkbox"
        checked={selectedAccounts.has(address)}
        onChange={() => toggleAccount(address)}
        className="w-4 h-4 text-blue-600"
      />
      <span className="ml-3 text-sm font-medium text-black">
        {/* {address.slice(0, 16)}...{address.slice(-4)} */}
        {address}
      </span>
    </label>
  ))

  return (
    <div className="flex flex-col items-start w-full gap-4">
      <SecondaryButton
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-blue-400 hover:bg-blue-500 text-white md:w-[300px] transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect Web3 Wallet'}
      </SecondaryButton>

      {showAccountModal && (
        <Modal
          message={
            <div>
              <p className="mb-4">Select accounts to connect:</p>
              <div className="max-h-60 flex flex-col overflow-y-auto space-y-1">{accountList}</div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {selectedAccounts.size} account{selectedAccounts.size !== 1 ? 's' : ''} selected
              </p>
            </div>
          }
          closeModal={() => setShowAccountModal(false)}
          onSubmit={handleAccountSelect}
        />
      )}
    </div>
  )
}
