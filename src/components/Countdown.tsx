'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  fechaFin: string | null;
}

export default function Countdown({ fechaFin }: CountdownProps) {
  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [expirado, setExpirado] = useState(false);

  useEffect(() => {
    if (!fechaFin) return;

    const calcular = () => {
      const fin = new Date(fechaFin).getTime();
      const ahora = Date.now();
      const diff = fin - ahora;

      if (diff <= 0) {
        setExpirado(true);
        return;
      }

      setTiempo({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diff / (1000 * 60)) % 60),
        segundos: Math.floor((diff / 1000) % 60),
      });
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [fechaFin]);

  if (!fechaFin) return null;

  if (expirado) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-700 dark:text-red-400 font-semibold">⏰ Esta rifa ha finalizado</p>
      </div>
    );
  }

  const bloques = [
    { valor: tiempo.dias, label: 'Días' },
    { valor: tiempo.horas, label: 'Horas' },
    { valor: tiempo.minutos, label: 'Min' },
    { valor: tiempo.segundos, label: 'Seg' },
  ];

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
      <p className="text-center text-sm text-orange-800 dark:text-orange-300 font-semibold mb-3">
        ⏰ Tiempo restante para el sorteo
      </p>
      <div className="grid grid-cols-4 gap-2">
        {bloques.map((b) => (
          <div key={b.label} className="bg-white dark:bg-gray-800 rounded-md p-2 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {String(b.valor).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
