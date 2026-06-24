'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getRifasActivas } from '@/lib/api';
import type { Rifa, Resultado } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VerificarPage() {
  const [idTransaccion, setIdTransaccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{
    encontrado: boolean;
    rifa: Rifa | null;
    numeros: string[];
    ganadores: Resultado[];
    numerosGanadores: string[];
    esGanador: boolean;
    mensaje: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idTransaccion.trim()) {
      setError('Ingresa un ID de transacción');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      // Obtener todas las rifas (activas y finalizadas)
      const rifas = await getRifasActivas();
      
      // Buscar en Google Apps Script los boletos con ese ID
      // Esto requeriría un nuevo endpoint, pero por ahora simulamos
      // En realidad necesitamos crear un endpoint nuevo en Apps Script
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APPS_SCRIPT_URL}?action=verificarBoleto&idTransaccion=${idTransaccion}`);
      const data = await response.json();
      
      if (!data.ok) {
        setError(data.mensaje || 'No se encontró un boleto con ese ID');
        setLoading(false);
        return;
      }

      // data debe tener: { rifa, numeros, esGanador, numerosGanadores, resultados }
      setResultado({
        encontrado: true,
        rifa: data.rifa,
        numeros: data.numeros,
        ganadores: data.resultados || [],
        numerosGanadores: data.numerosGanadores || [],
        esGanador: data.esGanador,
        mensaje: data.mensaje,
      });
    } catch (err) {
      setError('Error al verificar: ' + (err instanceof Error ? err.message : 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-primary hover:underline text-sm mb-4 inline-block">
          ← Volver al inicio
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            🎫 Verifica tu Boleto
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Ingresa tu ID de transacción para verificar si ganaste
          </p>

          <form onSubmit={handleVerificar} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID de Transacción
              </label>
              <input
                type="text"
                value={idTransaccion}
                onChange={(e) => setIdTransaccion(e.target.value.toUpperCase())}
                placeholder="Ej. RIFA-20260624183000-AB12"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono uppercase"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-md transition-colors"
            >
              {loading ? 'Verificando...' : 'Verificar Boleto'}
            </button>
          </form>
        </div>

        {resultado && resultado.rifa && (
          <div className={`rounded-lg shadow-md p-6 border-2 ${
            resultado.esGanador 
              ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400' 
              : 'bg-white border-gray-200'
          }`}>
            {resultado.esGanador && (
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">🎉</div>
                <h2 className="text-2xl font-bold text-yellow-700">
                  ¡FELICIDADES! ¡GANASTE!
                </h2>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                {resultado.rifa.nombre}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{resultado.rifa.descripcion}</p>
            </div>

            <div className="bg-white rounded-md p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Tus números:
              </p>
              <div className="flex flex-wrap gap-2">
                {resultado.numeros.map((num) => {
                  const esGanador = resultado.numerosGanadores.includes(num);
                  return (
                    <span
                      key={num}
                      className={`px-3 py-1 rounded-md font-mono font-semibold ${
                        esGanador
                          ? 'bg-yellow-500 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {num} {esGanador && '🏆'}
                    </span>
                  );
                })}
              </div>
            </div>

            {resultado.esGanador && resultado.ganadores.length > 0 && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-md p-4">
                <h4 className="font-bold text-yellow-800 mb-2">Premios ganados:</h4>
                {resultado.ganadores.map((ganador, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-yellow-900">{ganador.premio}</span>
                    <span className="font-bold text-yellow-700">#{ganador.numeroGanador}</span>
                  </div>
                ))}
              </div>
            )}

            {!resultado.esGanador && (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  Tu boleto no resultó ganador en esta ocasión.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  ¡Gracias por participar y apoyar a nuestra comunidad!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
      }
