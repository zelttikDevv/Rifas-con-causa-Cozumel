import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  const pathname = request.nextUrl.pathname;

  // Si es la página de login, permitir siempre
  if (pathname === '/admin/login') {
    // Si ya tiene sesión, redirigir al admin
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Si es ruta de admin y NO tiene cookie, redirigir a login
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
