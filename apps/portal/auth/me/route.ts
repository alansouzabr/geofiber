import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies(); // ✅ CORRETO

  const token = cookieStore.get('gf_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  return NextResponse.json({
    id: '1',
    name: 'Admin',
    role: 'ROOT',
  });
}
