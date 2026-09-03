import { httpGet, httpPost } from "@/shared/lib/http";
import type { AttendanceRecordInput, MonthlyAttendance } from "./types";

export function fetchMonthlyAttendance(courseId: string, year: number, month: number) {
	return httpGet<MonthlyAttendance>(`/courses/${courseId}/attendance?year=${year}&month=${month}`);
}

export function saveDailyAttendance(
	courseId: string,
	date: string,
	records: AttendanceRecordInput[],
) {
	return httpPost<{ saved: number }>(`/courses/${courseId}/attendance/day`, { date, records });
}

export function markNonInstructionalDay(courseId: string, date: string, reason: string) {
	return httpPost<{ id: string }>(`/courses/${courseId}/non-instructional-days`, { date, reason });
}
