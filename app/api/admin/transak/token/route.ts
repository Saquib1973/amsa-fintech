import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET() {
  const token = await prisma.config.findFirst({
    where: {
      key: "TRANSAK_ACCESS_TOKEN",
    },
  });

  if (!token) {
    return NextResponse.json({ error: "No Transak access token found" }, { status: 404 });
  }

  return NextResponse.json({ token: token.value });
}
