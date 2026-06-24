import Link from 'next/link';

export default function AdminMenu() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="font-bold text-gray-800 mb-3">Menú Admin</h3>
      <div className="space-y-2">
        <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm">
          📋 Reservas Pendientes
        </Link>
        <Link href="/admin/ventas" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm">
          💰 Ventas Generales
        </Link>
        <Link href="/admin/crear-rifa" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm">
          ➕ Crear Nueva Rifa
        </Link>
        <Link href="/admin/resultados" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm">
          🏆 Ingresar Resultados
        </Link>
      </div>
    </div>
  );
}
