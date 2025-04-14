'use client'
import SecondaryButton from '@/components/button/secondary-button'
import { Wallet } from '@prisma/client'
import toast from 'react-hot-toast'
import { useState } from 'react'
import Modal from '@/components/modal'

type WalletCardProps = {
  wallet: Wallet
}

export default function WalletCard({ wallet }: WalletCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  return (
    <>
      <div className="bg-white dark:bg-gray-950 border flex flex-col justify-between border-gray-100 dark:border-gray-800 rounded-md p-8">
        <div className='flex flex-col justify-around'>
          <h2 className="text-2xl font-light mb-4 dark:text-white">
            {wallet.type === 'fiat' ? 'Fiat Wallet' : 'Crypto Wallet'}
          </h2>
          <div className="space-y-4">
            {wallet.type !== 'fiat' && (
              <div>
                <div className="text-lg text-gray-600 dark:text-gray-400 font-light">
                  Address
                </div>
                <div className="text-lg text-gray-900 dark:text-white font-mono break-all">
                  {wallet.address}
                </div>
              </div>
            )}
            <div>
              <div className="text-lg text-gray-600 dark:text-gray-400 font-light">
                Balance
              </div>
              <div className="text-5xl font-light text-gray-900 dark:text-white">
                ${wallet.balance}
              </div>
            </div>
          </div>
        </div>
        <div className="flex ml-auto my-2">
          <SecondaryButton onClick={() => setShowDeleteModal(true)} className='bg-red-500 text-white'>Delete</SecondaryButton>
        </div>
      </div>

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
