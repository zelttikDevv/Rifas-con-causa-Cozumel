'use client';

import { useState } from 'react';
import { generarIdTransaccion, generarEnlaceWhatsApp, reservarBoletos } from '@/lib/api';
import type { Rifa } from '@/types';

interface ReservaPanelProps {
  rifa: Rifa;
  seleccionados: string[];
  onReservaExitosa: () => void;
  maxSeleccion: number;
}

export default function ReservaPanel({
  rifa,
  seleccionados,
  onReservaExitosa,
  maxSeleccion,
}: ReservaPanelProps) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const validarTelefono = (tel: string) => {
    // Elimina espacios, guiones y paréntesis
    const limpio = tel.replace(/[\s\-\(\)]/g, '');
    // Valida que sean 10 dígitos (México) o 10-15 dígitos (internacional)
    return /^\d{10,15}$/.test(limpio);
  };

  const handleConfirmar = async () => {
    // Validaciones
    if (seleccionados.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Selecciona al menos un número' });
      return;
    }

    if (!nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa tu nombre completo (como aparece en tu INE)' });
      return;
    }

    if (!telefono.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa tu número de teléfono' });
      return;
    }

    if (!validarTelefono(telefono)) {
      setMensaje({ tipo: 'error', texto: 'El teléfono debe tener 10 dígitos' });
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      const idTransaccion = generarIdTransaccion();
      const cliente = `${nombre.trim()} - Tel: ${telefono.trim()}`;
      const resultado = await reservarBoletos(rifa.id, seleccionados, idTransaccion, cliente);

      if (!resultado.ok) {
        setMensaje({ tipo: 'error', texto: resultado.mensaje });
        setCargando(false);
        return;
      }

      // Abrir WhatsApp
      const enlace = generarEnlaceWhatsApp(idTransaccion, seleccionados, rifa.nombre, nombre.trim(), telefono.trim());
      window.open(enlace, '_blank');

      setMensaje({
        tipo: 'ok',
        texto: `¡Reserva exitosa! ID: ${idTransaccion}. Se abrió WhatsApp para confirmar.`,
      });
      onReservaExitosa();
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al reservar',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Tu reserva</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Números seleccionados ({seleccionados.length}/{maxSeleccion}):
        </p>
        {seleccionados.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            Selecciona números en la cuadrícula
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {seleccionados.map((num) => (
              <span
                key={num}
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold"
              >
                {num}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Nombre completo * <span className="text-xs text-gray-500 font-normal">(como aparece en tu INE)</span>
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Juan Pérez García"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Número de teléfono * <span className="text-xs text-gray-500 font-normal">(10 dígitos)</span>
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej. 9871234567"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            mensaje.tipo === 'ok'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <button
        onClick={handleConfirmar}
        disabled={cargando || seleccionados.length === 0}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {cargando ? (
          'Reservando...'
        ) : (
          <>
            <span>📱</span>
            <span>Confirmar por WhatsApp</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Se abrirá WhatsApp con un mensaje prellenado para confirmar tu reserva
      </p>
    </div>
  );
            }
