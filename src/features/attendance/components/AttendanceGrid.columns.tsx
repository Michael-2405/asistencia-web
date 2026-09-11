import { createColumnHelper } from "@tanstack/react-table";
import { Ban, Lock, UserX } from "lucide-react";
import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import type { AttendanceStatusCode, CalendarDay, StudentAttendanceRow } from "../types";
import { computeStudentStats, getDayStatus } from "../utils";
import { StatusBadge } from "./StatusBadge";
import { TodayStatusPicker } from "./TodayStatusPicker";

const columnHelper = createColumnHelper<StudentAttendanceRow>();

interface BuildColumnsParams {
	calendarDays: CalendarDay[];
	todayIso: string;
	edits: Record<string, AttendanceStatusCode>;
	onStatusChange: (studentId: string, status: AttendanceStatusCode) => void;
	isTodaySubmitted: boolean;
}

export function buildAttendanceColumns({
	calendarDays,
	todayIso,
	edits,
	onStatusChange,
	isTodaySubmitted,
}: BuildColumnsParams) {
	const dayColumns = calendarDays.map(({ date, nonInstructional }) => {
		const status = getDayStatus(date, todayIso, nonInstructional);
		const isEditableToday = status === "today" && !isTodaySubmitted;

		return columnHelper.display({
			id: date,
			size: 44,
			header: () => <DayHeader date={date} status={status} />,
			cell: ({ row }) => {
				const student = row.original;
				const isWithdrawnAtDate =
					!student.active && student.withdrawalDate !== null && date >= student.withdrawalDate;

				if (isWithdrawnAtDate) {
					return (
						<BlockedIcon icon={<UserX className="size-3.5" />} tooltip="Estudiante retirado" />
					);
				}
				if (isEditableToday) {
					return (
						<TodayStatusPicker
							value={edits[student.studentId] ?? "P"}
							onChange={(s) => onStatusChange(student.studentId, s)}
						/>
					);
				}
				if (status === "nonInstructional") {
					return <BlockedIcon icon={<Ban className="size-3.5" />} tooltip="No laborable" />;
				}

				const saved = student.statusByDate[date] as AttendanceStatusCode | undefined;
				if (status === "past" || status === "future") {
					if (saved) return <StatusBadge status={saved} />;
					return (
						<BlockedIcon
							icon={<Lock className="size-3.5" />}
							tooltip={status === "past" ? "Fecha pasada" : "Fecha futura"}
						/>
					);
				}
				return <StatusBadge status={saved ?? null} />;
			},
		});
	});

	const summaryColumns = [
		columnHelper.display({
			id: "P",
			size: 40,
			header: () => <SummaryHeader label="P" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).present,
		}),
		columnHelper.display({
			id: "T",
			size: 40,
			header: () => <SummaryHeader label="T" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).late,
		}),
		columnHelper.display({
			id: "A",
			size: 40,
			header: () => <SummaryHeader label="A" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).absent,
		}),
		columnHelper.display({
			id: "E",
			size: 40,
			header: () => <SummaryHeader label="E" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).excused,
		}),
		columnHelper.display({
			id: "pct",
			size: 60,
			header: () => <SummaryHeader label="% Asist." />,
			cell: ({ row }) => {
				const stats = computeStudentStats(row.original.statusByDate);
				const isRisk = stats.percentage < 80;
				return (
					<span
						className={`inline-block rounded px-1.5 py-0.5 text-xs font-extrabold ${isRisk ? "bg-[#FDECEA] text-[#C62828]" : "text-[#1a1d21]"}`}
					>
						{stats.percentage}%
					</span>
				);
			},
		}),
	];

	return [
		columnHelper.accessor("rollNumber", { header: "Nº", size: 30 }),
		columnHelper.accessor("fullName", {
			header: "Estudiante",
			size: 210,
			cell: ({ row }) => {
				const student = row.original;
				const stats = computeStudentStats(student.statusByDate);
				return (
					<div className="flex flex-col gap-0.5">
						<span
							className={
								student.active
									? "font-semibold text-[#1a1d21]"
									: "font-medium italic text-[#9a9ea5] line-through"
							}
						>
							{student.fullName}
							{!student.active && "  ·  INACTIVO"}
						</span>
						{student.active && stats.hasConsecutiveAbsenceAlert && (
							<Tooltip>
								<TooltipTrigger
									render={
										<span className="inline-flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] font-bold text-[#B45309] bg-[#FFF1DE]">
											2+ ausencias consecutivas
										</span>
									}
								/>
								<TooltipContent>
									Detectado en el cliente a partir del historial de asistencia
								</TooltipContent>
							</Tooltip>
						)}
					</div>
				);
			},
		}),
		...dayColumns,
		...summaryColumns,
	];
}

function BlockedIcon({ icon, tooltip }: { icon: ReactNode; tooltip: string }) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={<span className="flex items-center justify-center text-[#c4c7cc]">{icon}</span>}
			/>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	);
}

function DayHeader({ date, status }: { date: string; status: ReturnType<typeof getDayStatus> }) {
	const d = new Date(`${date}T00:00:00`);
	const dow = d.toLocaleDateString("es-DO", { weekday: "short" });
	const num = d.getDate();
	const cls =
		status === "today"
			? "bg-[#CE1126] text-white"
			: status === "nonInstructional"
				? "bg-[repeating-linear-gradient(45deg,#c7c9cc,#c7c9cc_4px,#dcdedf_4px,#dcdedf_8px)] text-[#6b6f76]"
				: status === "future"
					? "bg-[#EDEFF2] text-[#a8adb5]"
					: "bg-[#1a3d8f] text-white";
	return (
		<div className={`flex flex-col items-center gap-px rounded px-1 py-1.5 ${cls}`}>
			<span className="text-[9.5px] uppercase opacity-85">{dow}</span>
			<span className="text-[13px] font-extrabold">{num}</span>
		</div>
	);
}

function SummaryHeader({ label }: { label: string }) {
	return (
		<div className="rounded bg-[#E8EEF9] px-1 py-1.5 text-center text-[10px] font-extrabold text-[#003087]">
			{label}
		</div>
	);
}
