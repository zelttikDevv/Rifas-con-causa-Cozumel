'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminMenu from '@/components/AdminMenu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si existe la cookie de sesión
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          // No autenticado, redirigir a login
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el useEffect ya redirigió)
  if (!isAuthenticated) {
    return null;
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
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/admin/login');
              }}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-semibold"
            >
              Cerrar sesión
            </button>
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
