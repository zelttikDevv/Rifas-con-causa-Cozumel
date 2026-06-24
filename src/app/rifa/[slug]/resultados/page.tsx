'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getRifaPorSlug, getResultadosRifa } from '@/lib/api';
import type { Rifa, Resultado } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ResultadosPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const rifaData = await getRifaPorSlug(slug);
        setRifa(rifaData);

        const resultadosData = await getResultadosRifa(rifaData.id);
        setResultados(resultadosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (error || !rifa) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold">Error al cargar</p>
            <p className="text-sm text-red-600 mt-2">{error || 'Rifa no encontrada'}</p>
            <Link href="/" className="text-primary underline mt-4 inline-block">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-primary hover:underline text-sm mb-4 inline-block">
          ← Volver al inicio
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
              RIFA FINALIZADA
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {rifa.nombre}
          </h1>
          <p className="text-gray-600 mb-4">{rifa.descripcion}</p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
            <p className="text-orange-800 font-semibold text-center">
              🏆 Resultados Oficiales del Sorteo
            </p>
          </div>
        </div>

        {resultados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              Los resultados se publicarán pronto
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Vuelve más tarde para ver los números ganadores
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {resultados.map((resultado, idx) => (
              <div
                key={idx}
                className={`rounded-lg shadow-md p-6 border-2 ${
                  idx === 0
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400'
                    : idx === 1
                    ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400'
                    : 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{resultado.premio}</h3>
                  {idx === 0 && <span className="text-3xl">🥇</span>}
                  {idx === 1 && <span className="text-3xl">🥈</span>}
                  {idx === 2 && <span className="text-3xl">🥉</span>}
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-600 mb-1">Número ganador:</p>
                  <p className="text-4xl font-bold text-center text-gray-800 font-mono">
                    {resultado.numeroGanador}
                  </p>
                </div>
                
                {resultado.fuente && (
                  <p className="text-sm text-gray-600 italic">
                    📋 Fuente: {resultado.fuente}
                  </p>
                )}
                
                {resultado.fechaSorteo && (
                  <p className="text-xs text-gray-500 mt-2">
                    Fecha del sorteo: {resultado.fechaSorteo}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/verificar"
            className="inline-block bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            🎫 Verificar mi Boleto
          </Link>
        </div>
      </div>
    </main>
  );
          }
