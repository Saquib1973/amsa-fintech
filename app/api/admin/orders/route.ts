import transak from '@api/transak'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const { data } = await transak.getOrders({
      limit: 100,
      skip: 0,
      'filter[productsAvailed]': ['%5B%22BUY%22%5D'],
      'filter[status]': 'COMPLETED',
      'filter[sortOrder]': 'desc',
      'filter[walletAddress]': walletAddress,
      'access-token':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBUElfS0VZIjoiMjQ1N2Y0YzctMDVlYS00NTc0LWI5NjYtMWM2Mzc0NWIyYzFmIiwiaWF0IjoxNzQ0MjE2NDg4LCJleHAiOjE3NDQ4MjEyODh9.oTYPDovhENqMJlW4BKlfPc6u6iXu4jGgVTp5wLnFt0k',
    })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
