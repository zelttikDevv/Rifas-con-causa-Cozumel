import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  const pathname = request.nextUrl.pathname;

  // LOG para debuggear en Vercel
  console.log('🔒 MIDDLEWARE:', {
    pathname,
    tieneCookie: !!sessionCookie,
    valorCookie: sessionCookie?.value?.substring(0, 5) || 'NINGUNA',
  });

  // Permitir SIEMPRE la página de login
  if (pathname === '/admin/login') {
    console.log('✅ Permitiendo acceso a /admin/login');
    return NextResponse.next();
  }

  // Para cualquier ruta de admin, verificar cookie
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    console.log('🔐 Ruta admin detectada:', pathname);
    
    if (!sessionCookie) {
      console.log('❌ SIN cookie, redirigiendo a login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('✅ Con cookie, permitiendo acceso');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
