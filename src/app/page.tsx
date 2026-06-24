'use client';

import { useEffect, useState } from 'react';
import { getRifasActivas, getRifasFinalizadas } from '@/lib/api';
import type { Rifa } from '@/types';
import RifaCard from '@/components/RifaCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function Home() {
  const [rifasActivas, setRifasActivas] = useState<Rifa[]>([]);
  const [rifasFinalizadas, setRifasFinalizadas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarRifas() {
      try {
        const [activas, finalizadas] = await Promise.all([
          getRifasActivas(),
          getRifasFinalizadas(),
        ]);
        setRifasActivas(activas);
        setRifasFinalizadas(finalizadas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    cargarRifas();
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🎟️ Rifas con causa Cozumel
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Apoyando a nuestra comunidad, una rifa a la vez
          </p>

          <Link
            href="/verificar"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            <span className="text-xl">🎫</span>
            <span>Verifica tu Boleto</span>
          </Link>
        </header>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 mb-6">
            <p className="font-semibold">Error al cargar las rifas</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Sección: Rifas Activas */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Rifas Activas
                </h2>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
                  {rifasActivas.length} {rifasActivas.length === 1 ? 'disponible' : 'disponibles'}
                </span>
              </div>

              {rifasActivas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    No hay rifas activas en este momento
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Vuelve pronto para ver nuevas rifas
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rifasActivas.map((rifa) => (
                    <RifaCard key={rifa.id} rifa={rifa} />
                  ))}
                </div>
              )}
            </section>

            {/* Sección: Rifas Finalizadas */}
            {rifasFinalizadas.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Rifas Finalizadas
                  </h2>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">
                    {rifasFinalizadas.length} {rifasFinalizadas.length === 1 ? 'finalizada' : 'finalizadas'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rifasFinalizadas.map((rifa) => (
                    <RifaCard key={rifa.id} rifa={rifa} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Enlace a "Cómo funciona" */}
        <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <Link 
            href="/como-funciona" 
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors"
          >
            ¿Cómo funciona? • Preguntas frecuentes
          </Link>
        </div>

      </div>
    </main>
  );
            }
