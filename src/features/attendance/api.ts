import type {
	AttendanceRecordInput,
	CalendarDay,
	MonthlyAttendance,
	StudentAttendanceRow,
} from "./types";

interface MockStore {
	records: Record<string, Record<string, AttendanceRecordInput["status"]>>;
	nonInstructionalDays: Record<string, Set<string>>;
}

const store: MockStore = { records: {}, nonInstructionalDays: {} };

function delay<T>(value: T, ms = 250): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function generateCalendarDays(year: number, month: number, courseId: string): CalendarDay[] {
	const days: CalendarDay[] = [];
	const daysInMonth = new Date(year, month, 0).getDate();
	const nonInstructional = store.nonInstructionalDays[courseId] ?? new Set<string>();

	for (let d = 1; d <= daysInMonth; d++) {
		const date = new Date(year, month - 1, d);
		const dow = date.getDay();
		if (dow === 0 || dow === 6) continue;
		const iso = date.toISOString().split("T")[0];
		days.push({ date: iso, nonInstructional: nonInstructional.has(iso) });
	}
	return days;
}

interface StudentRef {
	id: string;
	rollNumber: number;
	fullName: string;
}

export async function fetchMonthlyAttendance(
	courseId: string,
	year: number,
	month: number,
	students: StudentRef[],
): Promise<MonthlyAttendance> {
	const calendarDays = generateCalendarDays(year, month, courseId);

	const rows: StudentAttendanceRow[] = students.map((s) => {
		const statusByDate: StudentAttendanceRow["statusByDate"] = {};
		for (const day of calendarDays) {
			const dayRecord = store.records[`${courseId}-${day.date}`];
			const status = dayRecord?.[s.id];
			if (status) statusByDate[day.date] = status;
		}
		return { studentId: s.id, rollNumber: s.rollNumber, fullName: s.fullName, statusByDate };
	});

	return delay({ calendarDays, rows });
}

export async function saveDailyAttendance(
	courseId: string,
	date: string,
	records: AttendanceRecordInput[],
) {
	const key = `${courseId}-${date}`;
	if (store.records[key]) {
		throw new Error("La asistencia de este día ya fue registrada");
	}
	store.records[key] = Object.fromEntries(records.map((r) => [r.studentId, r.status]));
	return delay({ ok: true });
}

export async function markNonInstructionalDay(courseId: string, date: string, _reason: string) {
	if (!store.nonInstructionalDays[courseId]) store.nonInstructionalDays[courseId] = new Set();
	store.nonInstructionalDays[courseId].add(date);
	return delay({ ok: true });
}
