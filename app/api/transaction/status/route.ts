import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the access token from the database
    const accessTokenConfig = await prisma.config.findFirst({
      where: {
        key: 'TRANSAK_ACCESS_TOKEN',
      },
    });

    if (!accessTokenConfig) {
      return NextResponse.json(
        { error: 'Transak access token not found' },
        { status: 500 }
      );
    }

    const parsedToken = JSON.parse(accessTokenConfig.value);

    // Make the request to Transak API
    const response = await fetch(
      `https://api-stg.transak.com/partners/api/v2/order/${orderId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'access-token': parsedToken.accessToken,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to fetch order status' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
