import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

interface AttendanceInfoCardProps {
	courseLabel: string;
	studentCountLabel: string;
	workingDaysCount: number;
	totalDaysCount: number;
	monthOptions: { year: number; month: number; label: string }[];
	selectedYear: number;
	selectedMonth: number;
	onMonthChange: (year: number, month: number) => void;
	isTodaySubmitted: boolean;
	onSave: () => void;
	saving: boolean;
	canSave: boolean;
	onMarkNonInstructionalDay: () => void;
}

export function AttendanceInfoCard({
	courseLabel,
	studentCountLabel,
	workingDaysCount,
	totalDaysCount,
	monthOptions,
	selectedYear,
	selectedMonth,
	onMonthChange,
	isTodaySubmitted,
	onSave,
	saving,
	canSave,
	onMarkNonInstructionalDay,
}: AttendanceInfoCardProps) {
	const value = `${selectedYear}-${selectedMonth}`;

	return (
		<div className="flex flex-col gap-4">
			<Link to="/courses" className="text-xs font-semibold text-[#8a8f98]">
				← Mis Cursos
			</Link>

			<div className="flex flex-col gap-4 rounded-[10px] border border-[#E0E0E0] bg-white p-5.5">
				<div className="flex flex-wrap items-start justify-between gap-6">
					<div className="flex flex-col gap-1">
						<div className="flex flex-wrap items-baseline gap-2.5">
							<h1 className="text-2xl font-extrabold text-[#003087]">{courseLabel}</h1>
							<span className="text-[13px] text-[#5b5f66]">{studentCountLabel}</span>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-3.5">
						<div className="flex flex-col gap-1">
							<span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a8f98]">
								Mes activo
							</span>
							<Select
								value={value}
								onValueChange={(v) => {
									if (v === null) return;
									const [y, m] = v.split("-").map(Number);
									onMonthChange(y, m);
								}}
							>
								<SelectTrigger className="w-45 border-[#d5d8dc] text-[#1a1d21]">
									<SelectValue>
										{(v: string) =>
											monthOptions.find((o) => `${o.year}-${o.month}` === v)?.label ?? ""
										}
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
						<div className="flex flex-col gap-0.5 rounded-[7px] bg-[#F5F5F5] px-3.5 py-2">
							<span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a8f98]">
								Días trabajados
							</span>
							<span className="text-[16px] font-bold text-[#1a1d21]">
								{workingDaysCount}{" "}
								<span className="text-xs font-medium text-[#8a8f98]">
									de {totalDaysCount} hábiles
								</span>
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EEE] pt-3.5">
					<div className="flex items-center gap-2.5">
						{canSave && !isTodaySubmitted && (
							<Button
								onClick={onSave}
								disabled={saving}
								className="bg-[#003087] hover:bg-[#002468]"
							>
								{saving ? "Guardando…" : "Guardar"}
							</Button>
						)}
						{canSave && isTodaySubmitted && (
							<div className="flex items-center gap-1.5 text-[12.5px] text-[#5b5f66]">
								<span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
								Asistencia de hoy registrada
							</div>
						)}
					</div>
					<Button
						variant="outline"
						className="border-[1.5px] border-[#003087] text-[#003087]"
						onClick={onMarkNonInstructionalDay}
					>
						Marcar día no laborable
					</Button>
				</div>
			</div>
		</div>
	);
}
