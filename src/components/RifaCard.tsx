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
    OTRO: ' Otro',
  };

  const tiempoRestante =
    !estaFinalizada && fechaFin
      ? formatDistanceToNow(fechaFin, { addSuffix: true, locale: es })
      : null;

  // ─── RIFA FINALIZADA ──
  if (estaFinalizada) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-gray-200 dark:border-gray-700 opacity-75 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-gray-500 dark:bg-gray-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
            Finalizada
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{rifa.nombre}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{rifa.descripcion}</p>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4 mb-4 text-center">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">
            🏆 Esta rifa ha terminado
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Consulta los números ganadores
          </p>
        </div>

        <Link
          href={`/rifa/${rifa.slug}/resultados`}
          className="block w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded-md text-center transition-colors"
        >
          Ver Resultados 🏆
        </Link>
      </div>
    );
  }

  // ── RIFA ACTIVA ───
  return (
    <Link href={`/rifa/${rifa.slug}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 cursor-pointer border border-gray-100 dark:border-gray-700 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-500 dark:bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
            Activa
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{rifa.nombre}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-1">
          {rifa.descripcion}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Premios:</span>
            <span className="text-gray-600 dark:text-gray-400">{rifa.premios}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Sorteo:</span>
            <span className="text-gray-600 dark:text-gray-400">
              {tipoSorteoLabel[rifa.tipoSorteo] || rifa.tipoSorteo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Boletos:</span>
            <span className="text-gray-600 dark:text-gray-400">{rifa.totalBoletos}</span>
          </div>

          {tiempoRestante && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Termina:</span>
              <span className="text-orange-600 dark:text-orange-400 font-medium">{tiempoRestante}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-primary dark:text-blue-400 font-semibold text-sm">
            Ver detalles →
          </span>
        </div>
      </div>
    </Link>
  );
}
