import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';



export async function GET() {
  const getCookies = await cookies();
  const nextAuthToken = getCookies.get('next-auth.session-token')?.value;

  return NextResponse.json({ token: nextAuthToken });
}


