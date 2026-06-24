import { NextResponse } from 'next/server';

export async function GET() {
  const sessionCookie = process.env.ADMIN_TOKEN;
  
  if (!sessionCookie) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Esta ruta solo se llama desde el servidor (middleware) o 
  // desde el cliente con la cookie httpOnly
  // Si llegamos aquí, es porque el middleware ya validó
  return NextResponse.json({ ok: true });
}
