import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  const apiSecret = process.env.TRANSAK_API_SECRET;
  const apiKey = process.env.TRANSAK_API_KEY;

  if (!apiSecret || !apiKey) {
    return NextResponse.json({ error: 'Missing Transak API credentials' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api-stg.transak.com/partners/api/v2/refresh-token', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-secret': apiSecret,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

    const data = await response.json();
    const previousToken = await prisma.config.findFirst({
      where: {
        key: 'TRANSAK_ACCESS_TOKEN',
      },
    })
    if (previousToken) {
      await prisma.config.update({
        where: { id: previousToken.id },
        data: { value: JSON.stringify(data.data) },
      })
    } else {
      await prisma.config.create({
        data: {
          key: 'TRANSAK_ACCESS_TOKEN',
          value: JSON.stringify(data.data),
          type: 'JSON',
        },
      })
    }
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to refresh token' }, { status: response.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}