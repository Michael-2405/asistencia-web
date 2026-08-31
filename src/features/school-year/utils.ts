import type { MonthOption } from "./types";

const MONTH_LABELS = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

export function generateMonthOptions(startDate: string, endDate: string): MonthOption[] {
	const [startYear, startMonth] = startDate.split("-").map(Number);
	const [endYear, endMonth] = endDate.split("-").map(Number);

	const options: MonthOption[] = [];
	let year = startYear;
	let month = startMonth;

	while (year < endYear || (year === endYear && month <= endMonth)) {
		options.push({ year, month, label: `${MONTH_LABELS[month - 1]} ${year}` });
		month += 1;
		if (month > 12) {
			month = 1;
			year += 1;
		}
	}

	return options;
}
