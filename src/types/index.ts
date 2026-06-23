export type EstadoRifa = 'BORRADOR' | 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';
export type EstadoBoleto = 'DISPONIBLE' | 'RESERVADO' | 'PAGADO';
export type TipoSorteo = 'LOTERIA_NACIONAL' | 'TOMBOLA_FB' | 'OTRO';

export interface Rifa {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  tipoSorteo: TipoSorteo;
  premios: string;
  totalBoletos: number;
  estado?: EstadoRifa;
  urlFacebook?: string;
}

export interface Boleto {
  numero: string;
  estado: EstadoBoleto;
  idTransaccion: string;
}

export interface Resultado {
  numeroGanador: string;
  premio: string;
  fechaSorteo: string;
  fuente: string;
}

export interface Reserva {
  idTransaccion: string;
  idRifa: string;
  numeros: string[];
  fechaReserva: string;
  cliente: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  mensaje?: string;
  [key: string]: T | boolean | string | undefined;
}

export interface RifasResponse extends ApiResponse {
  rifas: Rifa[];
}

export interface RifaResponse extends ApiResponse {
  rifa: Rifa;
}

export interface BoletosResponse extends ApiResponse {
  boletos: Boleto[];
}

export interface ResultadosResponse extends ApiResponse {
  resultados: Resultado[];
}

export interface ReservasResponse extends ApiResponse {
  reservas: Reserva[];
}
