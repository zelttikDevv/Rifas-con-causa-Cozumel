import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminMenu from '@/components/AdminMenu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  const adminToken = process.env.ADMIN_TOKEN;

  console.log('[Admin Layout]', {
    hasCookie: !!sessionCookie,
    hasToken: !!adminToken,
    cookieMatches: sessionCookie?.value === adminToken,
  });

  // Verificar autenticación en el servidor
  if (!sessionCookie || sessionCookie.value !== adminToken) {
    console.log('[Admin Layout] No autenticado, redirigiendo');
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              🎟️ Admin - Rifas Cozumel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary">
              Ver sitio
            </a>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-semibold"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-4 flex-grow">
        <AdminMenu />
        {children}
      </div>
    </div>
  );
}
