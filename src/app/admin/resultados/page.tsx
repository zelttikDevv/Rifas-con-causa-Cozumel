'use client';

import { useState, useEffect } from 'react';
import { ingresarResultados, getRifasActivas } from '@/lib/api';
import Link from 'next/link';
import type { Rifa } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ResultadosPage() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await getRifasActivas();
        setRifas(data);
      } catch (err) {
        setMensaje('Error al cargar rifas');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    const formData = new FormData(e.currentTarget);
    const idRifa = formData.get('rifa') as string;
    const resultados = [
      {
        numeroGanador: formData.get('numero1') as string,
        premio: formData.get('premio1') as string,
        fechaSorteo: formData.get('fechaSorteo') as string,
        fuente: formData.get('fuente') as string,
      },
    ];

    // Agregar segundo y tercer premio si existen
    if (formData.get('numero2')) {
      resultados.push({
        numeroGanador: formData.get('numero2') as string,
        premio: formData.get('premio2') as string,
        fechaSorteo: formData.get('fechaSorteo') as string,
        fuente: formData.get('fuente') as string,
      });
    }

    if (formData.get('numero3')) {
      resultados.push({
        numeroGanador: formData.get('numero3') as string,
        premio: formData.get('premio3') as string,
        fechaSorteo: formData.get('fechaSorteo') as string,
        fuente: formData.get('fuente') as string,
      });
    }

    try {
      const resultado = await ingresarResultados(idRifa, resultados);
      if (resultado.ok) {
        setMensaje(`✅ ${resultado.mensaje}`);
        (e.target as HTMLFormElement).reset();
      } else {
        setMensaje(`❌ Error: ${resultado.mensaje}`);
      }
    } catch (err) {
      setMensaje('Error al ingresar resultados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Link href="/admin" className="text-primary hover:underline text-sm">
          ← Volver al admin
        </Link>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Ingresar Resultados</h2>
      </div>

      {mensaje && (
        <div className={`mb-4 p-4 rounded-md ${mensaje.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Selecciona la rifa *
          </label>
          <select
            name="rifa"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Selecciona --</option>
            {rifas.map((rifa) => (
              <option key={rifa.id} value={rifa.id}>
                {rifa.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha del sorteo
          </label>
          <input
            name="fechaSorteo"
            type="datetime-local"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fuente (opcional)
          </label>
          <input
            name="fuente"
            type="text"
            placeholder="Ej. Lotería Nacional 24/06/2026"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <hr className="my-4" />

        <h3 className="font-bold text-gray-800">Primer Premio</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número *</label>
            <input name="numero1" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Premio *</label>
            <input name="premio1" type="text" required placeholder="1er Premio" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="font-bold text-gray-800">Segundo Premio (opcional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
            <input name="numero2" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Premio</label>
            <input name="premio2" type="text" placeholder="2do Premio" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="font-bold text-gray-800">Tercer Premio (opcional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
            <input name="numero3" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Premio</label>
            <input name="premio3" type="text" placeholder="3er Premio" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-md transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar Resultados'}
        </button>
      </form>
    </main>
  );
                        }
