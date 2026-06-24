export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Creado con <span className="text-red-500">❤️</span> por <span className="font-semibold text-gray-800 dark:text-gray-100">Zelttzz</span>
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          © {new Date().getFullYear()} Rifas con causa Cozumel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
