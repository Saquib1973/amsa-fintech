import { NextResponse } from 'next/server'

const TRANSAK_CRYPTOCOVERAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TRANSAK_ENV === 'PROD'
    ? 'https://api.transak.com/cryptocoverage/api/v1/public'
    : 'https://api-stg.transak.com/cryptocoverage/api/v1/public'

export async function GET() {
  try {
    const response = await fetch(
      `${TRANSAK_CRYPTOCOVERAGE_BASE_URL}/crypto-currencies`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching crypto currencies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crypto currencies' },
      { status: 500 }
    )
  }
}

