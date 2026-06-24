'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  titulo: string;
  descripcion: string;
  url: string;
}

export default function ShareButtons({ titulo, descripcion, url }: ShareButtonsProps) {
  const [copiado, setCopiado] = useState(false);

  const mensaje = `¡Mira esta rifa! ${titulo}\n${descripcion}\n`;

  const enlaces = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(mensaje + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
        📢 Comparte esta rifa con tus amigos
      </p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <a
          href={enlaces.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          <span>💬</span> WhatsApp
        </a>
        
        <a
          href={enlaces.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          <span>📘</span> Facebook
        </a>
        
        <button
          onClick={copiarEnlace}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            copiado 
              ? 'bg-gray-600 text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{copiado ? '✅' : ''}</span> 
          {copiado ? '¡Copiado!' : 'Copiar enlace'}
        </button>
      </div>
    </div>
  );
}
