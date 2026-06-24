export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm">
          Creado con <span className="text-red-500">❤️</span> por <span className="font-semibold text-gray-800">Zelttzz</span>
        </p>
        <p className="text-gray-400 text-xs mt-1">
          © {new Date().getFullYear()} Rifas con causa Cozumel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
