'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Componente interno que usa useSearchParams
function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(data.mensaje || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          placeholder="Ingresa la contraseña"
          autoFocus
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-800 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold py-2 rounded-md transition-colors"
      >
        {loading ? 'Verificando...' : 'Ingresar'}
      </button>
    </form>
  );
}

// Componente principal con Suspense boundary
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          🔐 Panel de Administración
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Ingresa la contraseña para acceder
        </p>

        <Suspense
          fallback={
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Cargando...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <Link 
          href="/" 
          className="block text-center text-sm text-primary dark:text-blue-400 mt-4 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
