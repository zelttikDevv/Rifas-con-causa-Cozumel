import Link from 'next/link';
import type { Rifa } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RifaCardProps {
  rifa: Rifa;
}

export default function RifaCard({ rifa }: RifaCardProps) {
  const fechaFin = rifa.fechaFin ? new Date(rifa.fechaFin) : null;
  const tiempoRestante = fechaFin
    ? formatDistanceToNow(fechaFin, { addSuffix: true, locale: es })
    : null;

  const tipoSorteoLabel = {
    LOTERIA_NACIONAL: '🎰 Lotería Nacional',
    TOMBOLA_FB: '📹 Tómbola en Facebook Live',
    OTRO: '🎲 Otro',
  };

  return (
    <Link href={`/rifa/${rifa.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{rifa.nombre}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rifa.descripcion}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Premios:</span>
            <span className="text-gray-600">{rifa.premios}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Sorteo:</span>
            <span className="text-gray-600">{tipoSorteoLabel[rifa.tipoSorteo]}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Boletos:</span>
            <span className="text-gray-600">{rifa.totalBoletos} disponibles</span>
          </div>
          
          {tiempoRestante && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Termina:</span>
              <span className="text-orange-600 font-medium">{tiempoRestante}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-primary font-semibold text-sm">Ver detalles →</span>
        </div>
      </div>
    </Link>
  );
}
