import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { WalletService } from '@/services/backend/wallet-services'
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const walletId = (await params).id
    if (!walletId) {
      return NextResponse.json(
        { error: 'Wallet ID is required' },
        { status: 400 }
      )
    }

    const walletService = new WalletService()

    try {
      const wallet = await walletService.getWalletById(walletId)

      if (wallet.type === 'fiat') {
        return NextResponse.json(
          { error: 'Fiat wallets cannot be deleted' },
          { status: 400 }
        )
      }

      if (wallet.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      await walletService.deleteWallet(walletId)

      return NextResponse.json({ success: true })
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Wallet not found') {
        return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error('Error deleting wallet:', error)
    return NextResponse.json(
      { error: 'Error deleting wallet' },
      { status: 500 }
    )
  }
}