import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  console.log('[Logout API] Cerrando sesión');
  
  const cookieStore = cookies();
  cookieStore.delete('admin_session');
  
  const response = NextResponse.json({ ok: true, mensaje: 'Logout exitoso' });
  
  return response;
}
