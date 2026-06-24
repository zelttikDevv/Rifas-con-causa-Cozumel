import type {
  Rifa,
  Boleto,
  Resultado,
  Reserva,
  RifasResponse,
  RifaResponse,
  BoletosResponse,
  ResultadosResponse,
  ReservasResponse,
  TipoSorteo,
  EstadoRifa,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || '';

if (!BASE_URL) {
  console.error('NEXT_PUBLIC_APPS_SCRIPT_URL no está configurada en .env.local');
}

/**
 * Hace un GET a Apps Script.
 * Apps Script responde con JSON directo en GET (no hay problema de CORS).
 */
async function get<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL!);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url.toString(), {
    method: 'GET',
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json();
}

/**
 * Hace un POST a Apps Script.
 * IMPORTANTE: Content-Type debe ser "text/plain" para evitar preflight CORS.
 */
async function post<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(BASE_URL!, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json();
}

// ============================================================
//  API PÚBLICA (sin autenticación)
// ============================================================

/** Lista todas las rifas activas */
export async function getRifasActivas(): Promise<Rifa[]> {
  const data = await get<RifasResponse>({ action: 'getRifasActivas' });
  if (!data.ok) throw new Error(data.mensaje || 'Error al cargar rifas');
  return data.rifas;
}

/** Obtiene una rifa por su slug */
export async function getRifaPorSlug(slug: string): Promise<Rifa> {
  const data = await get<RifaResponse>({ action: 'getRifaPorSlug', slug });
  if (!data.ok) throw new Error(data.mensaje || 'Rifa no encontrada');
  return data.rifa;
}

/** Obtiene una rifa por su ID */
export async function getRifaPorId(id: string): Promise<Rifa> {
  const data = await get<RifaResponse>({ action: 'getRifaPorId', id });
  if (!data.ok) throw new Error(data.mensaje || 'Rifa no encontrada');
  return data.rifa;
}

/** Obtiene los boletos de una rifa */
export async function getBoletosRifa(idRifa: string): Promise<Boleto[]> {
  const data = await get<BoletosResponse>({ action: 'getBoletosRifa', idRifa });
  if (!data.ok) throw new Error(data.mensaje || 'Error al cargar boletos');
  return data.boletos;
}

/** Obtiene los resultados/ganadores de una rifa */
export async function getResultadosRifa(idRifa: string): Promise<Resultado[]> {
  const data = await get<ResultadosResponse>({ action: 'getResultadosRifa', idRifa });
  if (!data.ok) throw new Error(data.mensaje || 'Error al cargar resultados');
  return data.resultados;
}

/** Verifica si un boleto es ganador */
export async function verificarBoleto(idTransaccion: string): Promise<any> {
  const data = await get<any>({ action: 'verificarBoleto', idTransaccion });
  return data;
}

/** Reserva boletos (genera el enlace de WhatsApp después) */
export async function reservarBoletos(
  idRifa: string,
  numeros: string[],
  idTransaccion: string,
  cliente?: string
): Promise<{ ok: boolean; mensaje: string }> {
  const data = await post<{ ok: boolean; mensaje: string }>({
    action: 'reservarBoletos',
    idRifa,
    numeros,
    idTransaccion,
    cliente: cliente || '',
  });
  return { ok: data.ok, mensaje: data.mensaje || '' };
}

// ============================================================
//  API ADMIN (requiere token)
// ============================================================

/** Crea una nueva rifa */
export async function crearRifa(rifa: {
  nombre: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoSorteo?: TipoSorteo;
  premios?: string;
  totalBoletos: number;
  estado?: EstadoRifa;
  urlFacebook?: string;
}): Promise<{ ok: boolean; mensaje: string; idRifa?: string; slug?: string }> {
  const data = await post({
    action: 'crearRifa',
    token: ADMIN_TOKEN,
    rifa,
  });
  return data as { ok: boolean; mensaje: string; idRifa?: string; slug?: string };
}

/** Actualiza una rifa existente */
export async function actualizarRifa(
  idRifa: string,
  rifa: Partial<{
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    tipoSorteo: TipoSorteo;
    premios: string;
    estado: EstadoRifa;
    urlFacebook: string;
  }>
): Promise<{ ok: boolean; mensaje: string }> {
  const data = await post({
    action: 'actualizarRifa',
    token: ADMIN_TOKEN,
    idRifa,
    rifa,
  });
  return data as { ok: boolean; mensaje: string };
}

/** Cancela una rifa (cambia estado a CANCELADA) */
export async function eliminarRifa(idRifa: string): Promise<{ ok: boolean; mensaje: string }> {
  const data = await post({
    action: 'eliminarRifa',
    token: ADMIN_TOKEN,
    idRifa,
  });
  return data as { ok: boolean; mensaje: string };
}

/** Confirma el pago de una reserva */
export async function confirmarPago(
  idRifa: string,
  idTransaccion: string
): Promise<{ ok: boolean; mensaje: string }> {
  const data = await post({
    action: 'confirmarPago',
    token: ADMIN_TOKEN,
    idRifa,
    idTransaccion,
  });
  return data as { ok: boolean; mensaje: string };
}

/** Ingresa resultados/ganadores de una rifa */
export async function ingresarResultados(
  idRifa: string,
  resultados: Array<{
    numeroGanador: string;
    premio: string;
    fechaSorteo?: string;
    fuente?: string;
  }>
): Promise<{ ok: boolean; mensaje: string }> {
  const data = await post({
    action: 'ingresarResultados',
    token: ADMIN_TOKEN,
    idRifa,
    resultados,
  });
  return data as { ok: boolean; mensaje: string };
}

/** Lista reservas pendientes (solo de rifas activas) */
export async function listarReservasPendientes(idRifa?: string): Promise<Reserva[]> {
  const data = await post<ReservasResponse>({
    action: 'listarReservasPendientes',
    token: ADMIN_TOKEN,
    idRifa: idRifa || '',
  });
  if (!data.ok) throw new Error(data.mensaje || 'Error al listar reservas');
  return data.reservas;
}

/** Lista todas las ventas (pagadas y pendientes) con filtros */
export async function listarTodasLasVentas(
  idRifa?: string,
  estado?: string
): Promise<any[]> {
  const data = await post({
    action: 'listarTodasLasVentas',
    token: ADMIN_TOKEN,
    idRifa: idRifa || '',
    estado: estado || '',
  });
  if (!data.ok) throw new Error(data.mensaje || 'Error al listar ventas');
  return data.ventas;
}

// ============================================================
//  UTILIDADES
// ============================================================

/** Genera un ID de transacción único */
export function generarIdTransaccion(): string {
  const ahora = new Date();
  const fecha = ahora.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RIFA-${fecha}-${random}`;
}

/** Genera el enlace de WhatsApp con mensaje prellenado */
export function generarEnlaceWhatsApp(
  idTransaccion: string,
  numeros: string[],
  nombreRifa: string,
  nombreCliente: string,
  telefonoCliente: string
): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO || '';
  const mensaje =
    `Hola, quiero confirmar mi reserva.\n\n` +
    `🎟️ Rifa: ${nombreRifa}\n` +
    `👤 Nombre: ${nombreCliente}\n` +
    `📞 Teléfono: ${telefonoCliente}\n` +
    `🆔 ID de transacción: ${idTransaccion}\n` +
    `🔢 Números: ${numeros.join(', ')}\n\n` +
    `¿Cómo puedo realizar el pago?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    }
