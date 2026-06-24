import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  const pathname = request.nextUrl.pathname;

  // DEBUG: Log en consola del servidor
  console.log('[Middleware]', {
    pathname,
    hasCookie: !!sessionCookie,
    cookieValue: sessionCookie?.value?.substring(0, 10) + '...',
  });

  // Rutas de autenticación (siempre permitir)
  if (pathname.startsWith('/api/auth')) {
    console.log('[Middleware] Permitiendo /api/auth');
    return NextResponse.next();
  }

  // Páginas públicas (siempre permitir)
  const publicRoutes = ['/', '/verificar', '/como-funciona'];
  if (publicRoutes.includes(pathname) || pathname.startsWith('/rifa/')) {
    console.log('[Middleware] Ruta pública:', pathname);
    return NextResponse.next();
  }

  // Rutas de admin
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  
  if (isAdminRoute) {
    console.log('[Middleware] Ruta admin detectada:', pathname);
    
    // Si NO tiene cookie, redirigir a login
    if (!sessionCookie) {
      console.log('[Middleware] SIN cookie, redirigiendo a login');
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('[Middleware] Con cookie, permitiendo acceso');
  }

  return NextResponse.next();
}

// Matcher explícito y completo
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (route handlers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    '/admin/:path*',
    '/admin',
    '/api/auth/:path*',
  ],
};
