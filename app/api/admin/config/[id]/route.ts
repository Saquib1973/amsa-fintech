import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin } from '@/actions/user';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const config = await prisma.config.findUnique({
    where: { id: (await params).id },
  });
  return NextResponse.json(config);
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const config = await prisma.config.update({
      where: { id: (await params).id },
      data: {
        key,
        value,
        type,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = await isSuperAdmin(session?.user?.id ?? '');

    if (!session?.user || !isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.config.delete({
      where: { id: (await params).id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}