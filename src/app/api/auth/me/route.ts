import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  const adminToken = process.env.ADMIN_TOKEN;

  if (!sessionCookie || !adminToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (sessionCookie.value === adminToken) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
