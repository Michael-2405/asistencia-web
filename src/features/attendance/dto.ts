export interface MonthlyAttendanceRowDto {
	numero_orden: number;
	matricula_id: string;
	nombre: string;
	apellido: string;
	asistencias: Record<string, string>;
}

export interface CalendarDayDto {
	fecha: string;
	noLaborable: boolean;
}

export interface MonthlyAttendanceResponseDto {
	dias: CalendarDayDto[];
	filas: MonthlyAttendanceRowDto[];
	seccion: { grado: string; nombre: string } | null;
}

export interface DailyAttendanceRowDto {
	numero_orden: number;
	matricula_id: string;
	nombre: string;
	apellido: string;
	estado_codigo: string | null;
}
