import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

interface AttendanceHeaderProps {
	courseLabel: string;
	workingDaysCount: number;
	monthOptions: { year: number; month: number; label: string }[];
	onMonthChange: (year: number, month: number) => void;
	selectedYear: number;
	selectedMonth: number;
}

export function AttendanceHeader({
	courseLabel,
	workingDaysCount,
	monthOptions,
	onMonthChange,
	selectedYear,
	selectedMonth,
}: AttendanceHeaderProps) {
	const todayLabel = new Date().toLocaleDateString("es-DO", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
	const value = `${selectedYear}-${selectedMonth}`;

	return (
		<div className="bg-[#003087] px-8 py-4.5">
			<Link to="/courses" className="text-xs font-medium text-[#9db3dd] hover:text-white">
				← Mis Cursos
			</Link>
			<div className="mt-1.5 flex flex-wrap items-start justify-between gap-3">
				<div>
					<div className="text-xl font-bold text-white">{courseLabel}</div>
					<div className="mt-1.5 flex flex-wrap gap-5 text-[13px] font-medium text-[#d7e0f5]">
						<span>
							Días trabajados: <b className="text-white">{workingDaysCount}</b>
						</span>
						<span>
							Fecha actual: <b className="text-white">{todayLabel}</b>
						</span>
					</div>
				</div>
				<Select
					value={value}
					onValueChange={(v) => {
						if (v === null) return;
						const [y, m] = v.split("-").map(Number);
						onMonthChange(y, m);
					}}
				>
					<SelectTrigger className="w-40 border-none bg-white text-xs font-semibold text-[#003087]">
						<SelectValue>
							{(v: string) => monthOptions.find((o) => `${o.year}-${o.month}` === v)?.label ?? ""}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{monthOptions.map((o) => (
							<SelectItem key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
