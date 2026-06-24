'use client';

import { useState, useRef, useEffect } from 'react';
import type { Boleto } from '@/types';

interface BoletosGridProps {
  boletos: Boleto[];
  seleccionados: string[];
  onToggle: (numero: string) => void;
  maxSeleccion: number;
}

export default function BoletosGrid({
  boletos,
  seleccionados,
  onToggle,
  maxSeleccion,
}: BoletosGridProps) {
  const [busqueda, setBusqueda] = useState('');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const obtenerClase = (boleto: Boleto) => {
    if (boleto.estado === 'PAGADO') {
      return 'bg-red-500 dark:bg-red-600 text-white cursor-not-allowed opacity-70';
    }
    if (boleto.estado === 'RESERVADO') {
      return 'bg-yellow-400 dark:bg-yellow-500 text-gray-800 dark:text-gray-900 cursor-not-allowed opacity-70';
    }
    if (seleccionados.includes(boleto.numero)) {
      return 'bg-green-600 dark:bg-green-500 text-white ring-2 ring-green-800 dark:ring-green-300 scale-105';
    }
    return 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800/50 cursor-pointer';
  };

  const puedeSeleccionar = (boleto: Boleto) => {
    if (boleto.estado !== 'DISPONIBLE') return false;
    if (seleccionados.includes(boleto.numero)) return true;
    return seleccionados.length < maxSeleccion;
  };

  const handleClick = (boleto: Boleto) => {
    if (!puedeSeleccionar(boleto)) return;
    onToggle(boleto.numero);
  };

  // Filtrar boletos según búsqueda
  const boletosFiltrados = busqueda.trim()
    ? boletos.filter(b => b.numero.includes(busqueda.trim()))
    : boletos;

  // Scroll al primer resultado cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda.trim() && boletosFiltrados.length > 0) {
      const primerNumero = boletosFiltrados[0].numero;
      refs.current[primerNumero]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [busqueda]);

  return (
    <div>
      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value.replace(/\D/g, ''))}
          placeholder="🔍 Buscar número..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {busqueda && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {boletosFiltrados.length} resultado(s) encontrado(s)
          </p>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded"></span>
          <span className="text-gray-700 dark:text-gray-300">Disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-600 dark:bg-green-500 rounded"></span>
          <span className="text-gray-700 dark:text-gray-300">Seleccionado</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-400 dark:bg-yellow-500 rounded"></span>
          <span className="text-gray-700 dark:text-gray-300">Reservado</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded"></span>
          <span className="text-gray-700 dark:text-gray-300">Pagado</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
        {boletosFiltrados.map((boleto) => (
          <button
            key={boleto.numero}
            ref={(el) => { refs.current[boleto.numero] = el; }}
            onClick={() => handleClick(boleto)}
            disabled={!puedeSeleccionar(boleto)}
            className={`aspect-square rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${obtenerClase(boleto)}`}
            title={
              boleto.estado === 'PAGADO'
                ? 'Pagado'
                : boleto.estado === 'RESERVADO'
                ? 'Reservado'
                : `Número ${boleto.numero}`
            }
          >
            {boleto.numero}
          </button>
        ))}
      </div>

      {busqueda && boletosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No se encontró el número "{busqueda}"
        </p>
      )}
    </div>
  );
              }
