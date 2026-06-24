'use client';

import { useState, useEffect } from 'react';
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
  
  // Validación en tiempo real
  const [errores, setErrores] = useState<{ nombre?: string; telefono?: string }>({});

  useEffect(() => {
    const nuevosErrores: { nombre?: string; telefono?: string } = {};
    
    if (nombre.trim() && nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    const telLimpio = telefono.replace(/[\s\-\(\)]/g, '');
    if (telefono.trim() && !/^\d{10,15}$/.test(telLimpio)) {
      nuevosErrores.telefono = 'Ingresa un teléfono válido (10-15 dígitos)';
    }
    
    setErrores(nuevosErrores);
  }, [nombre, telefono]);

  const validarTelefono = (tel: string) => {
    const limpio = tel.replace(/[\s\-\(\)]/g, '');
    return /^\d{10,15}$/.test(limpio);
  };

  const handleConfirmar = async () => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Tu reserva</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
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
                className="bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold animate-pulse"
              >
                {num}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Nombre completo * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(como aparece en tu INE)</span>
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Juan Pérez García"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
            errores.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errores.nombre && (
          <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Número de teléfono * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(10 dígitos)</span>
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej. 9871234567"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
            errores.telefono ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
        />
        {errores.telefono && (
          <p className="text-xs text-red-500 mt-1">{errores.telefono}</p>
        )}
      </div>

      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            mensaje.tipo === 'ok'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <button
        onClick={handleConfirmar}
        disabled={cargando || seleccionados.length === 0 || Object.keys(errores).length > 0}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
      >
        {cargando ? (
          'Reservando...'
        ) : (
          <>
            <span></span>
            <span>Confirmar por WhatsApp</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Se abrirá WhatsApp con un mensaje prellenado para confirmar tu reserva
      </p>
    </div>
  );
            }
