export type AttendanceStatusCode = "P" | "T" | "A" | "E";

export interface StudentAttendanceRow {
	rollNumber: number;
	enrollmentId: string;
	fullName: string;
	statusByDate: Record<string, string>;
}

export interface CalendarDay {
	date: string;
	nonInstructional: boolean;
}

export interface MonthlyAttendance {
	calendarDays: CalendarDay[];
	rows: StudentAttendanceRow[];
	section: { grade: string; name: string } | null;
}

export interface DailyAttendanceRow {
	rollNumber: number;
	enrollmentId: string;
	fullName: string;
	statusCode: AttendanceStatusCode | null;
}

export interface AttendanceRecordInput {
	enrollmentId: string;
	status: AttendanceStatusCode;
}
