import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  const pathname = request.nextUrl.pathname;

  // Permitir SIEMPRE acceso a la página de login
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Para cualquier otra ruta de admin, verificar cookie
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
