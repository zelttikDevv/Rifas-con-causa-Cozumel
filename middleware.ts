import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  const pathname = request.nextUrl.pathname;

  // Rutas públicas (siempre permitir)
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Verificar si es ruta de admin
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginPage = pathname === '/admin/login';

  // Si está en login y ya tiene sesión, ir al admin
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Si es ruta de admin y NO tiene sesión, redirigir a login
  if (isAdminRoute && !sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configurar matcher - IMPORTANTE: el orden importa
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
    '/api/auth/:path*'
  ],
};
