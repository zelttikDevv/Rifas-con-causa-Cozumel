'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearRifa } from '@/lib/api';
import Link from 'next/link';
import type { TipoSorteo, EstadoRifa } from '@/types';

export default function CrearRifaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    const formData = new FormData(e.currentTarget);

    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const fechaInicioStr = formData.get('fechaInicio') as string;
    const fechaFinStr = formData.get('fechaFin') as string;
    const tipoSorteo = formData.get('tipoSorteo') as TipoSorteo;
    const premios = formData.get('premios') as string;
    const totalBoletos = parseInt(formData.get('totalBoletos') as string);
    const estado = (formData.get('estado') as EstadoRifa) || 'ACTIVA';
    const urlFacebook = formData.get('urlFacebook') as string;

    // Validaciones
    if (!nombre.trim()) {
      setMensaje('❌ El nombre de la rifa es obligatorio');
      setLoading(false);
      return;
    }

    if (totalBoletos < 1 || totalBoletos > 10000) {
      setMensaje('❌ El total de boletos debe estar entre 1 y 10,000');
      setLoading(false);
      return;
    }

    const fechaInicio = fechaInicioStr ? new Date(fechaInicioStr) : new Date();
    const fechaFin = new Date(fechaFinStr);

    if (isNaN(fechaFin.getTime())) {
      setMensaje('❌ La fecha de fin no es válida');
      setLoading(false);
      return;
    }

    if (fechaInicio >= fechaFin) {
      setMensaje('❌ La fecha de inicio debe ser anterior a la fecha de fin');
      setLoading(false);
      return;
    }

    if (fechaInicio < new Date()) {
      setMensaje('⚠️ La fecha de inicio es en el pasado. ¿Deseas continuar?');
      // No detenemos el proceso, solo advertimos
    }

    try {
      const resultado = await crearRifa({
        nombre,
        descripcion,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        tipoSorteo,
        premios,
        totalBoletos,
        estado,
        urlFacebook,
      });

      if (resultado.ok) {
        setMensaje(`✅ Rifa creada exitosamente. ID: ${resultado.idRifa}`);
        setTimeout(() => router.push('/admin'), 2000);
      } else {
        setMensaje(`❌ Error: ${resultado.mensaje}`);
      }
    } catch (err) {
      setMensaje('Error al crear rifa: ' + (err instanceof Error ? err.message : 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Link href="/admin" className="text-primary hover:underline text-sm">
          ← Volver al admin
        </Link>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Crear Nueva Rifa</h2>
      </div>

      {mensaje && (
        <div className={`mb-4 p-4 rounded-md ${mensaje.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre de la rifa *
          </label>
          <input
            name="nombre"
            type="text"
            required
            placeholder="Ej. Rifa en apoyo a María García"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            rows={3}
            placeholder="Describe el propósito de la rifa"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fecha de inicio
            </label>
            <input
              name="fechaInicio"
              type="datetime-local"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Déjalo vacío para iniciar ahora</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fecha de fin *
            </label>
            <input
              name="fechaFin"
              type="datetime-local"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tipo de sorteo
          </label>
          <select
            name="tipoSorteo"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="TOMBOLA_FB">Tómbola en Facebook Live</option>
            <option value="LOTERIA_NACIONAL">Lotería Nacional</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Premios
          </label>
          <input
            name="premios"
            type="text"
            placeholder="Ej. 1er: $1,000 - 2do: $500 - 3ro: $200"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Total de boletos *
          </label>
          <input
            name="totalBoletos"
            type="number"
            min="1"
            max="10000"
            required
            placeholder="Ej. 100"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-gray-500 mt-1">Máximo 10,000 boletos por rifa</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Estado inicial
          </label>
          <select
            name="estado"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ACTIVA">Activa</option>
            <option value="BORRADOR">Borrador (no visible)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            URL de Facebook Live (opcional)
          </label>
          <input
            name="urlFacebook"
            type="url"
            placeholder="https://facebook.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-md transition-colors"
          >
            {loading ? 'Creando...' : 'Crear Rifa'}
          </button>
          <Link
            href="/admin"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-md text-center transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
          }
