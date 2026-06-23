'use client';

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
  const obtenerClase = (boleto: Boleto) => {
    if (boleto.estado === 'PAGADO') {
      return 'bg-red-500 text-white cursor-not-allowed opacity-70';
    }
    if (boleto.estado === 'RESERVADO') {
      return 'bg-yellow-400 text-gray-800 cursor-not-allowed opacity-70';
    }
    if (seleccionados.includes(boleto.numero)) {
      return 'bg-green-600 text-white ring-2 ring-green-800 scale-105';
    }
    return 'bg-green-100 text-green-900 hover:bg-green-200 cursor-pointer';
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

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-100 border border-green-300 rounded"></span>
          <span className="text-gray-700">Disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-600 rounded"></span>
          <span className="text-gray-700">Seleccionado</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-400 rounded"></span>
          <span className="text-gray-700">Reservado</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-red-500 rounded"></span>
          <span className="text-gray-700">Pagado</span>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
        {boletos.map((boleto) => (
          <button
            key={boleto.numero}
            onClick={() => handleClick(boleto)}
            disabled={!puedeSeleccionar(boleto)}
            className={`aspect-square rounded-md text-xs sm:text-sm font-semibold transition-all ${obtenerClase(boleto)}`}
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
    </div>
  );
}
