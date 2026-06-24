import Link from 'next/link';
import type { Rifa } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RifaCardProps {
  rifa: Rifa;
}

export default function RifaCard({ rifa }: RifaCardProps) {
  const fechaFin = rifa.fechaFin ? new Date(rifa.fechaFin) : null;
  const estaFinalizada = rifa.estado === 'FINALIZADA' || (fechaFin !== null && fechaFin < new Date());

  const tipoSorteoLabel: Record<string, string> = {
    LOTERIA_NACIONAL: '🎰 Lotería Nacional',
    TOMBOLA_FB: '📹 Tómbola en Facebook Live',
    OTRO: '🎲 Otro',
  };

  const tiempoRestante =
    !estaFinalizada && fechaFin
      ? formatDistanceToNow(fechaFin, { addSuffix: true, locale: es })
      : null;

  // ─── RIFA FINALIZADA ───
  if (estaFinalizada) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-gray-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
            Finalizada
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">{rifa.nombre}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rifa.descripcion}</p>

        <div className="bg-gray-50 rounded-md p-4 mb-4 text-center">
          <p className="text-gray-700 font-semibold">
            🏆 Esta rifa ha terminado
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Consulta los números ganadores
          </p>
        </div>

        <Link
          href={`/rifa/${rifa.slug}/resultados`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md text-center transition-colors"
        >
          Ver Resultados 🏆
        </Link>
      </div>
    );
  }

  // ─── RIFA ACTIVA ───
  return (
    <Link href={`/rifa/${rifa.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-100 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
            Activa
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">{rifa.nombre}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {rifa.descripcion}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-700 whitespace-nowrap">Premios:</span>
            <span className="text-gray-600">{rifa.premios}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Sorteo:</span>
            <span className="text-gray-600">
              {tipoSorteoLabel[rifa.tipoSorteo] || rifa.tipoSorteo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Boletos:</span>
            <span className="text-gray-600">{rifa.totalBoletos}</span>
          </div>

          {tiempoRestante && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Termina:</span>
              <span className="text-orange-600 font-medium">{tiempoRestante}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-primary font-semibold text-sm">
            Ver detalles →
          </span>
        </div>
      </div>
    </Link>
  );
}
