export type DayEditability = "editable" | "readonly" | "blocked";

export type DayStatus = "past" | "today" | "future" | "nonInstructional";

export function getDayStatus(date: string, todayIso: string, nonInstructional: boolean): DayStatus {
	if (nonInstructional) return "nonInstructional";
	if (date === todayIso) return "today";
	return date < todayIso ? "past" : "future";
}

export function getTodayIso(): string {
	return new Date().toISOString().split("T")[0];
}

export interface StudentTotals {
	present: number;
	absent: number;
	late: number;
	excused: number;
}

export function computeStudentTotals(statusByDate: Record<string, string>): StudentTotals {
	const totals: StudentTotals = { present: 0, absent: 0, late: 0, excused: 0 };
	for (const status of Object.values(statusByDate)) {
		if (status === "P") totals.present++;
		else if (status === "A") totals.absent++;
		else if (status === "T") totals.late++;
		else if (status === "E") totals.excused++;
	}
	return totals;
}

export function formatMonthYear(year: number, month: number): string {
	const date = new Date(year, month - 1, 1);
	const label = date.toLocaleDateString("es-DO", { month: "long", year: "numeric" });
	return label.charAt(0).toUpperCase() + label.slice(1);
}
