'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VerificarPage() {
  const [idTransaccion, setIdTransaccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APPS_SCRIPT_URL}?action=verificarBoleto&idTransaccion=${idTransaccion}`
      );
      const data = await response.json();

      if (!data.ok) {
        setError(data.mensaje || 'No se encontró un boleto con ese ID');
        setLoading(false);
        return;
      }

      setResultado(data);
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
             Verifica tu Boleto
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
              : resultado.numerosGanadores.length > 0 && !resultado.todosPagados
              ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-400'
              : 'bg-white border-gray-200'
          }`}>
            {/* Indicador de estado de pago */}
            <div className={`rounded-md p-3 mb-4 text-center ${
              resultado.todosPagados 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-yellow-100 border border-yellow-300'
            }`}>
              <p className={`font-semibold ${
                resultado.todosPagados ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {resultado.todosPagados ? '✅ Pago confirmado' : '️ Pago pendiente'}
              </p>
              {!resultado.todosPagados && (
                <p className="text-xs text-yellow-700 mt-1">
                  Debes confirmar el pago para poder reclamar premios
                </p>
              )}
            </div>

            {/* Mensaje de ganador */}
            {resultado.esGanador && (
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">🎉</div>
                <h2 className="text-2xl font-bold text-yellow-700">
                  ¡FELICIDADES! ¡GANASTE!
                </h2>
              </div>
            )}

            {/* Mensaje cuando hay números ganadores pero no está pagado */}
            {!resultado.esGanador && resultado.numerosGanadores.length > 0 && !resultado.todosPagados && (
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">⚠️</div>
                <h2 className="text-2xl font-bold text-orange-700">
                  ¡Tienes números ganadores!
                </h2>
                <p className="text-orange-600 mt-2">
                  Pero tu pago aún no ha sido confirmado
                </p>
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
                {resultado.numeros.map((num: string, idx: number) => {
                  const esGanador = resultado.numerosGanadores.includes(num);
                  const estado = resultado.estados[idx];
                  return (
                    <div key={num} className="relative">
                      <span
                        className={`inline-block px-4 py-2 rounded-md font-mono font-semibold ${
                          esGanador
                            ? 'bg-yellow-500 text-white animate-pulse'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {num} {esGanador && '🏆'}
                      </span>
                      {estado === 'RESERVADO' && (
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          !
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {resultado.esGanador && resultado.resultados.length > 0 && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-md p-4">
                <h4 className="font-bold text-yellow-800 mb-2">Premios ganados:</h4>
                {resultado.resultados.map((ganador: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-yellow-900">{ganador.premio}</span>
                    <span className="font-bold text-yellow-700">#{ganador.numeroGanador}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje cuando hay ganadores pero no pagado */}
            {!resultado.esGanador && resultado.numerosGanadores.length > 0 && !resultado.todosPagados && (
              <div className="bg-orange-100 border border-orange-300 rounded-md p-4">
                <h4 className="font-bold text-orange-800 mb-2">
                  ⚠️ Acción requerida:
                </h4>
                <p className="text-orange-900 text-sm mb-2">
                  Tu boleto tiene <strong>{resultado.numerosGanadores.length} número(s) ganador(es)</strong>, 
                  pero necesitas confirmar el pago para poder reclamar el premio.
                </p>
                <p className="text-orange-800 text-sm font-semibold">
                  Contacta al administrador lo antes posible para confirmar tu pago.
                </p>
              </div>
            )}

            {/* Mensaje cuando no hay ganadores */}
            {!resultado.esGanador && resultado.numerosGanadores.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  Tu boleto no resultó ganador en esta ocasión.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  ¡Gracias por participar y apoyar a nuestra comunidad!
                </p>
              </div>
            )}

            {/* Botón de contacto si hay ganadores pero no pagado */}
            {!resultado.esGanador && resultado.numerosGanadores.length > 0 && !resultado.todosPagados && (
              <div className="mt-4 text-center">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}?text=${encodeURIComponent(
                    `Hola, tengo el ID de transacción ${idTransaccion} y tengo números ganadores pero aún no he confirmado mi pago. ¿Cómo puedo realizar el pago?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition-colors"
                >
                  💬 Contactar por WhatsApp
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
            }
