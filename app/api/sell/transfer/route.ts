import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getSession()
  const user_id = session?.user.id
  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const {
      orderId,
      cryptoAmount,
      cryptoCurrency,
      walletAddress,
      network,
    } = await req.json()

    console.log('Processing sell transfer:', { orderId, cryptoAmount, cryptoCurrency, walletAddress, network })

    // Validate required parameters
    if (!orderId) {
      throw new Error('Order ID is required')
    }
    if (!cryptoAmount || cryptoAmount === 'undefined' || cryptoAmount === null) {
      throw new Error('Crypto amount is required and must be a valid number')
    }
    if (!cryptoCurrency || cryptoCurrency === 'undefined') {
      throw new Error('Crypto currency is required')
    }
    if (!walletAddress || walletAddress === 'undefined') {
      throw new Error('Wallet address is required')
    }
    if (!network || network === 'undefined') {
      throw new Error('Network is required')
    }

    // For now, just log that we reached the backend to complete payment
    console.log('✅ BACKEND REACHED: Sell transfer request received')
    console.log('📋 Payment Details:')
    console.log(`   Order ID: ${orderId}`)
    console.log(`   Amount: ${cryptoAmount} ${cryptoCurrency}`)
    console.log(`   Wallet: ${walletAddress}`)
    console.log(`   Network: ${network}`)
    console.log(`   User ID: ${user_id}`)
    // metamask api to transfer crypto
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate a mock transaction hash for testing
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`
    console.log(`🔗 Mock Transaction Hash: ${mockTransactionHash}`)

    // Update the transaction status in your database
    await prisma.transaction.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
        walletLink: `https://${network === 'polygon' || network === 'matic' ? 'polygonscan.com' : 'etherscan.io'}/tx/${mockTransactionHash}`,
      },
    })

    console.log('✅ Database updated with mock transaction hash')
    console.log('🎉 Sell transfer simulation completed successfully')

    return NextResponse.json({
      success: true,
      transactionHash: mockTransactionHash,
      message: 'Crypto transfer simulation completed (mock mode)',
    })

  } catch (error) {
    console.error('Error processing sell transfer:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process transfer' },
      { status: 500 }
    )
  }
}
