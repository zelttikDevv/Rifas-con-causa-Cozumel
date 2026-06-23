import type { Resultado } from '@/types';

interface ResultadosSectionProps {
  resultados: Resultado[];
}

export default function ResultadosSection({ resultados }: ResultadosSectionProps) {
  if (resultados.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🏆</span>
        <span>Resultados / Ganadores</span>
      </h3>

      <div className="space-y-3">
        {resultados.map((r, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-md p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800">{r.premio}</span>
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-md font-bold text-lg">
                #{r.numeroGanador}
              </span>
            </div>
            {r.fechaSorteo && (
              <p className="text-xs text-gray-600">Sorteado: {r.fechaSorteo}</p>
            )}
            {r.fuente && (
              <p className="text-xs text-gray-500 italic">Fuente: {r.fuente}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
