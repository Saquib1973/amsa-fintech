'use client'
import { Wallet } from '@prisma/client'
import toast from 'react-hot-toast'
import { useState } from 'react'
import Modal from '@/components/modal'
import HoverCard from '@/components/hover-card'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

type WalletCardProps = {
  wallet: Wallet
}

export default function WalletCard({ wallet }: WalletCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (!wallet.address) {
      toast.error('No address to copy')
      return
    }

    try {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
      toast.error('Failed to copy address')
    }
  }

  function handleWalletRemoval() {
    const deleteWallet = async () => {
      const toastId = toast.loading('Deleting wallet...')
      try {
        const response = await fetch(`/api/wallet/${wallet.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to delete wallet')
        }

        toast.success('Wallet deleted successfully', { id: toastId })
      } catch (error) {
        console.error('Error deleting wallet:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to delete wallet', { id: toastId })
      }
    }

    deleteWallet()
  }

  const content = (
    <div className="space-y-4">
      {wallet.type !== 'fiat' && (
        <div>
          <div className="text-sm text-gray-600 font-light">Address</div>
          <div className="flex items-center gap-2">
            <div className="text-base font-mono break-all">{wallet.address}</div>
            <motion.button
              onClick={handleCopyAddress}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 }}
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      )}
      <div>
        <div className="text-sm text-gray-600 font-light">Balance</div>
        <div className="text-3xl font-light">${wallet.balance}</div>
      </div>
    </div>
  )

  const deleteButton = (
    <div className="flex items-center justify-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      Delete
    </div>
  )

  return (
    <>
      <HoverCard
        title={wallet.type === 'fiat' ? 'Fiat Wallet' : 'Crypto Wallet'}
        content={content}
        actionButton={deleteButton}
        backgroundColor="bg-white"
        textColor="text-black"
        borderColor=""
        onClick={() => setShowDeleteModal(true)}
      />

      {showDeleteModal && (
        <Modal
          message="Are you sure you want to delete this wallet?"
          closeModal={() => setShowDeleteModal(false)}
          onSubmit={handleWalletRemoval}
        />
      )}
    </>
  )
}
