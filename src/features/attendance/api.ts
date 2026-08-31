import { httpGet, httpPost } from "../../shared/lib/http";
import { createLogger } from "../../shared/lib/logger";
import type { DailyAttendanceRowDto, MonthlyAttendanceResponseDto } from "./dto";
import { toDailyAttendanceRow, toMonthlyAttendance } from "./mappers";
import type { AttendanceRecordInput } from "./types";

const logger = createLogger("AttendanceApi");

export async function fetchMonthlyAttendance(sectionId: string, year: number, month: number) {
	logger.debug("Fetching monthly attendance", { sectionId, year, month });
	const dto = await httpGet<MonthlyAttendanceResponseDto>(
		`/secciones/${sectionId}/asistencia?anio=${year}&mes=${month}`,
	);
	return toMonthlyAttendance(dto);
}

export async function fetchDailyAttendance(sectionId: string, date: string) {
	logger.debug("Fetching daily attendance", { sectionId, date });
	const dtos = await httpGet<DailyAttendanceRowDto[]>(
		`/secciones/${sectionId}/asistencia/dia?fecha=${date}`,
	);
	return dtos.map(toDailyAttendanceRow);
}

export async function saveDailyAttendance(
	sectionId: string,
	date: string,
	records: AttendanceRecordInput[],
) {
	logger.info("Saving daily attendance", { sectionId, date, count: records.length });
	return httpPost<{ ok: boolean; guardados: number }>(`/secciones/${sectionId}/asistencia/dia`, {
		fecha: date,
		registros: records.map((r) => ({ matriculaId: r.enrollmentId, estado: r.status })),
	});
}

export async function markNonInstructionalDay(schoolYearId: string, date: string, reason: string) {
	logger.info("Marking non-instructional day", { schoolYearId, date, reason });
	return httpPost<{ ok: boolean }>(`/anios-escolares/${schoolYearId}/dias-no-lectivos`, {
		fecha: date,
		motivo: reason,
	});
}
