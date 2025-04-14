import { prisma } from '@/lib/prisma';
import { ethers } from 'ethers';

export class WalletService {
  /**
   * Connect a new wallet to a user
   * @param userId The ID of the user
   * @param address The wallet address
   * @param pubKey The public key
   * @returns The created wallet
   */
  async connectWallet(userId: string, address: string, pubKey: string) {
    try {
      // Check if wallet already exists (case-insensitive)
      const walletAlreadyExists = await prisma.wallet.findFirst({
        where: {
          address: {
            equals: address,
            mode: 'insensitive',
          },
        },
      })

      if (walletAlreadyExists) {
        throw new Error('Wallet already exists')
      }

      // Verify the public key matches the address (case-insensitive)
      const recoveredAddress = ethers.utils.computeAddress(pubKey)
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Invalid public key for address')
      }

      // Create the wallet with the original case
      const wallet = await prisma.wallet.create({
        data: {
          userId,
          type: 'web3',
          address,
          publicKey: pubKey,
          balance: 0,
        },
      })

      return wallet
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }
  /**
   * Get all wallets for a user
   * @param userId The ID of the user
   * @returns Array of wallets
   */
  async getUserWallets(userId: string) {
    try {
      const wallets = await prisma.wallet.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          address: true,
          type: true,
          balance: true,
        },
      })

      return wallets
    } catch (error) {
      console.error('Error fetching user wallets:', error)
      throw new Error('Failed to fetch user wallets')
    }
  }
  /**
   * Get wallet by ID
   * @param walletId The ID of the wallet
   * @returns The wallet
   */
  async getWalletById(walletId: string) {
    try {
      const wallet = await prisma.wallet.findUnique({
        where: {
          id: walletId,
        },
      })

      if (!wallet) {
        throw new Error('Wallet not found')
      }

      return wallet
    } catch (error) {
      console.error('Error fetching wallet:', error)
      throw error
    }
  }

  /**
   * Update wallet balance
   * @param walletId The ID of the wallet
   * @param balance The new balance
   * @returns The updated wallet
   */
  async updateWalletBalance(walletId: string, balance: number) {
    try {
      const wallet = await prisma.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance,
        },
      })

      return wallet
    } catch (error) {
      console.error('Error updating wallet balance:', error)
      throw error
    }
  }

  /**
   * Delete a wallet
   * @param walletId The ID of the wallet
   * @returns The deleted wallet
   */
  async deleteWallet(walletId: string) {
    try {
      const wallet = await prisma.wallet.delete({
        where: {
          id: walletId,
        },
      })

      return wallet
    } catch (error) {
      console.error('Error deleting wallet:', error)
      throw error
    }
  }
}
