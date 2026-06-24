'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Cargar preferencia guardada o detectar preferencia del sistema
    const guardado = localStorage.getItem('theme');
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const inicial = guardado === 'dark' || (!guardado && prefiereOscuro);
    setDark(inicial);
    
    if (inicial) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const nuevo = !dark;
    setDark(nuevo);
    localStorage.setItem('theme', nuevo ? 'dark' : 'light');
    
    if (nuevo) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-md hover:scale-110 transition-transform"
      aria-label="Cambiar tema"
    >
      {dark ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  );
}
