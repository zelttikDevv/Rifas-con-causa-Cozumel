import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true, mensaje: 'Logout exitoso' });
  
  response.cookies.delete('admin_session');
  
  return response;
}
