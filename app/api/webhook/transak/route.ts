import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Verify webhook signature if needed
    // const signature = req.headers.get('x-transak-signature')
    
    const { eventName, data } = body
    
    if (eventName === 'TRANSAK_ORDER_CREATED') {
      // Handle order created event
      console.log('Order created webhook:', data)
      
      // Update transaction status
      if (data.id) {
        await prisma.transaction.update({
          where: { id: data.id },
          data: {
            status: 'PENDING',
            statusHistories: data.statusHistories,
          },
        })
      }
    }
    
    if (eventName === 'TRANSAK_ORDER_PROCESSING') {
      // Handle order processing event
      console.log('Order processing webhook:', data)
      
      if (data.id) {
        await prisma.transaction.update({
          where: { id: data.id },
          data: {
            status: 'PROCESSING',
            statusHistories: data.statusHistories,
          },
        })
      }
    }
    
    if (eventName === 'TRANSAK_ORDER_COMPLETED') {
      // Handle order completed event
      console.log('Order completed webhook:', data)
      
      if (data.id) {
        await prisma.transaction.update({
          where: { id: data.id },
          data: {
            status: 'COMPLETED',
            statusHistories: data.statusHistories,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}