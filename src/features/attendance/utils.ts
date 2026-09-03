export type DayStatus = "past" | "today" | "future" | "nonInstructional";

export function getDayStatus(date: string, todayIso: string, nonInstructional: boolean): DayStatus {
	if (nonInstructional) return "nonInstructional";
	if (date === todayIso) return "today";
	return date < todayIso ? "past" : "future";
}

export function getTodayIso(): string {
	return new Date().toISOString().split("T")[0];
}

export interface StudentStats {
	present: number;
	late: number;
	absent: number;
	excused: number;
	percentage: number;
	hasConsecutiveAbsenceAlert: boolean;
}

export function computeStudentStats(statusByDate: Record<string, string>): StudentStats {
	let present = 0;
	let late = 0;
	let absent = 0;
	let excused = 0;
	let maxConsecutiveAbsences = 0;
	let currentStreak = 0;

	const sortedDates = Object.keys(statusByDate).sort();
	for (const date of sortedDates) {
		const status = statusByDate[date];
		if (status === "P") present++;
		else if (status === "T") late++;
		else if (status === "A") {
			absent++;
			currentStreak++;
			maxConsecutiveAbsences = Math.max(maxConsecutiveAbsences, currentStreak);
		} else if (status === "E") excused++;
		if (status !== "A") currentStreak = 0;
	}

	const marked = present + late + absent + excused;
	const percentage = marked > 0 ? Math.round(((present + late) / marked) * 100) : 100;

	return {
		present,
		late,
		absent,
		excused,
		percentage,
		hasConsecutiveAbsenceAlert: maxConsecutiveAbsences >= 2,
	};
}
