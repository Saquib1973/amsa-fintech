import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      addresses: true,
      accounts: true,
    },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json({
    message: 'user information fetched successfully',
    user,
  })
}

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id
  const body = await request.json()
  const { address, city, state, zip, country } = body;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { addresses: true }
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  if (user.addresses) {
    const newAddress = await prisma.address.update({
      where: { id: user.addresses.id },
      data: { address: address ?? user.addresses.address, city: city ?? user.addresses.city, state: state ?? user.addresses.state, zip: zip ?? user.addresses.zip, country: country ?? user.addresses.country },
    })
    return NextResponse.json({ message: 'address updated successfully', newAddress })
  } else {
    const newAddress = await prisma.address.create({
      data: { address: address ?? '', city: city ?? '', state: state ?? '', zip: zip ?? '', country: country ?? '', userId },
    })
    return NextResponse.json({ message: 'address added successfully', newAddress })
  }
}
