import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth');

  // Permitir acceso a rutas de autenticación
  if (isApiAuth) {
    return NextResponse.next();
  }

  // Si está en la página de login y ya tiene sesión, redirigir al admin
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Si intenta acceder a rutas admin sin sesión, redirigir al login
  if (isAdminRoute && !sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
};
