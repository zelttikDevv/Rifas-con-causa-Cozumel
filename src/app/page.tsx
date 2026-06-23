'use client';

import { useEffect, useState } from 'react';
import { getRifasActivas } from '@/lib/api';
import type { Rifa } from '@/types';
import RifaCard from '@/components/RifaCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarRifas() {
      try {
        const data = await getRifasActivas();
        setRifas(data);
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🎟️ Rifas con causa Cozumel
          </h1>
          <p className="text-gray-600">
            Apoyando a nuestra comunidad, una rifa a la vez
          </p>
        </header>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold">Error al cargar las rifas</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && rifas.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              No hay rifas activas en este momento
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Vuelve pronto para ver nuevas rifas
            </p>
          </div>
        )}

        {!loading && !error && rifas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rifas.map((rifa) => (
              <RifaCard key={rifa.id} rifa={rifa} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
