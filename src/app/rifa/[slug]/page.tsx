'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getRifaPorSlug, getBoletosRifa, getResultadosRifa } from '@/lib/api';
import type { Rifa, Boleto, Resultado } from '@/types';
import Countdown from '@/components/Countdown';
import BoletosGrid from '@/components/BoletosGrid';
import ReservaPanel from '@/components/ReservaPanel';
import ResultadosSection from '@/components/ResultadosSection';
import ShareButtons from '@/components/ShareButtons';
import LoadingSpinner from '@/components/LoadingSpinner';

const MAX_SELECCION = 5;

export default function RifaDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const rifaData = await getRifaPorSlug(slug);
        setRifa(rifaData);

        const [boletosData, resultadosData] = await Promise.all([
          getBoletosRifa(rifaData.id),
          getResultadosRifa(rifaData.id),
        ]);

        setBoletos(boletosData);
        setResultados(resultadosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la rifa');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [slug]);

  const toggleNumero = (numero: string) => {
    setSeleccionados((prev) =>
      prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero]
    );
  };

  const recargarBoletos = async () => {
    if (!rifa) return;
    try {
      const data = await getBoletosRifa(rifa.id);
      setBoletos(data);
      setSeleccionados([]);
    } catch (err) {
      console.error('Error al recargar boletos', err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !rifa) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold">Error al cargar la rifa</p>
            <p className="text-sm text-red-600 mt-2">{error || 'Rifa no encontrada'}</p>
            <Link href="/" className="text-primary underline mt-4 inline-block">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tipoSorteoLabel: Record<string, string> = {
    LOTERIA_NACIONAL: '🎰 Lotería Nacional',
    TOMBOLA_FB: '📹 Tómbola en Facebook Live',
    OTRO: '🎲 Otro',
  };

  const urlActual = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-primary hover:underline text-sm mb-4 inline-block">
          ← Volver a rifas
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {rifa.nombre}
          </h1>
          <p className="text-gray-600 mb-4">{rifa.descripcion}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-gray-500 text-xs">Tipo de sorteo</p>
              <p className="font-semibold text-gray-800">{tipoSorteoLabel[rifa.tipoSorteo] || rifa.tipoSorteo}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-gray-500 text-xs">Total de boletos</p>
              <p className="font-semibold text-gray-800">{rifa.totalBoletos}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-gray-500 text-xs">Premios</p>
              <p className="font-semibold text-gray-800">{rifa.premios}</p>
            </div>
          </div>

          <Countdown fechaFin={rifa.fechaFin} />

          {rifa.urlFacebook && (
            <a
              href={rifa.urlFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              📹 Ver tómbola en Facebook Live
            </a>
          )}
        </div>

        {/* Botones para compartir */}
        <div className="mb-6">
          <ShareButtons 
            titulo={rifa.nombre} 
            descripcion={rifa.descripcion} 
            url={urlActual} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-5 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Selecciona tus números
            </h2>
            <BoletosGrid
              boletos={boletos}
              seleccionados={seleccionados}
              onToggle={toggleNumero}
              maxSeleccion={MAX_SELECCION}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <ReservaPanel
                rifa={rifa}
                seleccionados={seleccionados}
                onReservaExitosa={recargarBoletos}
                maxSeleccion={MAX_SELECCION}
              />
              <ResultadosSection resultados={resultados} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
            }
