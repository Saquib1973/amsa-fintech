import { prisma } from '@/lib/prisma'
import transak from '@api/transak'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }
    const accessToken = await prisma.config.findFirst({
      where: {
        key: 'TRANSAK_ACCESS_TOKEN',
      },
    })

    const parsedToken = JSON.parse(accessToken?.value || '{}')

    const { data } = await transak.getOrders({
      limit: 100,
      skip: 0,
      'filter[productsAvailed]': ['%5B%22BUY%22%5D'],
      'filter[status]': 'COMPLETED',
      'filter[sortOrder]': 'desc',
      'filter[walletAddress]': walletAddress,
      'access-token': parsedToken.accessToken || '',
    })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
