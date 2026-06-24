import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  const pathname = request.nextUrl.pathname;
  
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginPage = pathname === '/admin/login';
  const isApiAuth = pathname.startsWith('/api/auth');

  // Permitir acceso a rutas de autenticación
  if (isApiAuth) {
    return NextResponse.next();
  }

  // Si está en la página de login y ya tiene sesión, redirigir al admin
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Si intenta acceder a rutas admin (incluyendo /admin) sin sesión, redirigir al login
  if (isAdminRoute && !sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/api/auth/:path*'],
};
