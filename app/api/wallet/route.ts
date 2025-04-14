import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { WalletService } from '@/services/backend/wallet-services'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { address, pubKey } = await req.json()

    if (!address || !pubKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const walletService = new WalletService()

    try {
      const wallet = await walletService.connectWallet(
        session.user.id,
        address,
        pubKey
      )
      return NextResponse.json(wallet)
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Wallet already exists') {
          return NextResponse.json(
            { error: 'Wallet already exists' },
            { status: 400 }
          )
        } else if (error.message === 'Invalid public key for address') {
          return NextResponse.json(
            { error: 'Invalid public key for address' },
            { status: 400 }
          )
        }
      }
      throw error
    }
  } catch (error) {
    console.error('Wallet connection error:', error)
    return NextResponse.json(
      { error: 'Error connecting wallet' },
      { status: 500 }
    )
  }
}
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const walletService = new WalletService()
    const wallets = await walletService.getUserWallets(session.user.id)

    return NextResponse.json({ wallets })
  } catch (error) {
    console.error('Error fetching wallets:', error)
    return NextResponse.json(
      { error: 'Error fetching wallets' },
      { status: 500 }
    )
  }
}