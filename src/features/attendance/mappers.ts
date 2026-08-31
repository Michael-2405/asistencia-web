import type {
	DailyAttendanceRowDto,
	MonthlyAttendanceResponseDto,
	MonthlyAttendanceRowDto,
} from "./dto";
import type { DailyAttendanceRow, MonthlyAttendance, StudentAttendanceRow } from "./types";

export function toMonthlyAttendance(dto: MonthlyAttendanceResponseDto): MonthlyAttendance {
	return {
		calendarDays: dto.dias.map((d) => ({ date: d.fecha, nonInstructional: d.noLaborable })),
		rows: dto.filas.map(toStudentAttendanceRow),
		section: dto.seccion ? { grade: dto.seccion.grado, name: dto.seccion.nombre } : null,
	};
}

function toStudentAttendanceRow(dto: MonthlyAttendanceRowDto): StudentAttendanceRow {
	return {
		rollNumber: dto.numero_orden,
		enrollmentId: dto.matricula_id,
		fullName: `${dto.apellido}, ${dto.nombre}`,
		statusByDate: dto.asistencias,
	};
}

export function toDailyAttendanceRow(dto: DailyAttendanceRowDto): DailyAttendanceRow {
	return {
		rollNumber: dto.numero_orden,
		enrollmentId: dto.matricula_id,
		fullName: `${dto.apellido}, ${dto.nombre}`,
		statusCode: (dto.estado_codigo as DailyAttendanceRow["statusCode"]) ?? null,
	};
}
