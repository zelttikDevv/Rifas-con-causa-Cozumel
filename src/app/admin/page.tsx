'use client';

import { useEffect, useState } from 'react';
import { listarReservasPendientes, confirmarPago } from '@/lib/api';
import { getRifasActivas } from '@/lib/api';
import type { Reserva, Rifa } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [filtroRifa, setFiltroRifa] = useState<string>('');

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [reservasData, rifasData] = await Promise.all([
        listarReservasPendientes(),
        getRifasActivas(),
      ]);
      setReservas(reservasData);
      setRifas(rifasData);
    } catch (err) {
      setMensaje('Error al cargar datos: ' + (err instanceof Error ? err.message : 'Desconocido'));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmarPago(idRifa: string, idTransaccion: string) {
    if (!confirm('¿Confirmar que se recibió el pago?')) return;

    try {
      const resultado = await confirmarPago(idRifa, idTransaccion);
      if (resultado.ok) {
        setMensaje(`✅ ${resultado.mensaje}`);
        await cargarDatos();
      } else {
        setMensaje(`❌ Error: ${resultado.mensaje}`);
      }
    } catch (err) {
      setMensaje('Error al confirmar pago: ' + (err instanceof Error ? err.message : 'Desconocido'));
    }

    setTimeout(() => setMensaje(null), 5000);
  }

  const reservasFiltradas = filtroRifa
    ? reservas.filter((r) => r.idRifa === filtroRifa)
    : reservas;

  const obtenerNombreRifa = (idRifa: string) => {
    const rifa = rifas.find((r) => r.id === idRifa);
    return rifa?.nombre || idRifa;
  };

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reservas Pendientes</h2>
        <p className="text-gray-600">Gestiona las reservas y confirma los pagos</p>
      </div>

      {mensaje && (
        <div className={`mb-4 p-4 rounded-md ${mensaje.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {mensaje}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Filtrar por rifa:
        </label>
        <select
          value={filtroRifa}
          onChange={(e) => setFiltroRifa(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las rifas</option>
          {rifas.map((rifa) => (
            <option key={rifa.id} value={rifa.id}>
              {rifa.nombre}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && reservasFiltradas.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No hay reservas pendientes</p>
          <p className="text-sm text-gray-500 mt-2">
            Las reservas aparecerán aquí cuando los clientes las hagan
          </p>
        </div>
      )}

      {!loading && reservasFiltradas.length > 0 && (
        <div className="space-y-4">
          {reservasFiltradas.map((reserva) => (
            <div key={reserva.idTransaccion} className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs font-semibold">
                      {reserva.idTransaccion}
                    </span>
                    <span className="text-sm text-gray-500">{reserva.fechaReserva}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Rifa:</span> {obtenerNombreRifa(reserva.idRifa)}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Números:</span>{' '}
                    <span className="font-mono font-semibold text-gray-800">
                      {reserva.numeros.join(', ')}
                    </span>
                  </p>
                  
                  {reserva.cliente && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Cliente:</span> {reserva.cliente}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}?text=Hola%20respecto%20a%20tu%20reserva%20${reserva.idTransaccion}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold text-center transition-colors"
                  >
                    💬 Contactar
                  </a>
                  
                  <button
                    onClick={() => handleConfirmarPago(reserva.idRifa, reserva.idTransaccion)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                  >
                    ✅ Confirmar Pago
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
    }
