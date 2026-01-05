import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin } from '@/actions/user';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const configs = await prisma.config.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching configs:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = await isSuperAdmin(session?.user?.id ?? '');

    if (!session?.user || !isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { key, value, type } = body;

    if (!key || !value || !type) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const config = await prisma.config.create({
      data: {
        key,
        value,
        type,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error creating config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}