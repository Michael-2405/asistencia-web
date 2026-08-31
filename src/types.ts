export interface AsistenciaFila {
	numero_orden: number;
	matricula_id: string;
	nombre: string;
	apellido: string;
	asistencias: Record<string, string>;
}

export interface AsistenciaResponse {
	diasLectivos: string[];
	filas: AsistenciaFila[];
}
