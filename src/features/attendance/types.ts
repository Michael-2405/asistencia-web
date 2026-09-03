export type AttendanceStatusCode = "P" | "T" | "A" | "E";

export interface CalendarDay {
	date: string;
	nonInstructional: boolean;
}

export interface StudentAttendanceRow {
	studentId: string;
	rollNumber: number;
	fullName: string;
	statusByDate: Record<string, AttendanceStatusCode>;
}

export interface MonthlyAttendance {
	calendarDays: CalendarDay[];
	rows: StudentAttendanceRow[];
}

export interface AttendanceRecordInput {
	studentId: string;
	status: AttendanceStatusCode;
}
