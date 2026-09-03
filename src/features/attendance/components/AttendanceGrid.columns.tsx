import { createColumnHelper } from "@tanstack/react-table";
import { Ban, Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import type { AttendanceStatusCode, CalendarDay, StudentAttendanceRow } from "../types";
import { computeStudentStats, getDayStatus } from "../utils";
import { StatusBadge } from "./StatusBadge";
import { StatusSelector } from "./StatusSelector";

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
			size: status === "today" ? 84 : 42,
			header: () => <DayHeader date={date} status={status} />,
			cell: ({ row }) => {
				const studentId = row.original.studentId;

				if (isEditableToday) {
					return (
						<StatusSelector
							value={edits[studentId] ?? "P"}
							onChange={(s) => onStatusChange(studentId, s)}
						/>
					);
				}
				if (status === "nonInstructional") {
					return <BlockedIcon icon={<Ban className="size-3.5" />} tooltip="No laborable" />;
				}

				const saved = row.original.statusByDate[date] as AttendanceStatusCode | undefined;
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
			header: () => <SummaryHeader label="P" bg="bg-[#166534]" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).present,
		}),
		columnHelper.display({
			id: "T",
			size: 40,
			header: () => <SummaryHeader label="T" bg="bg-[#92400e]" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).late,
		}),
		columnHelper.display({
			id: "A",
			size: 40,
			header: () => <SummaryHeader label="A" bg="bg-[#991b1b]" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).absent,
		}),
		columnHelper.display({
			id: "E",
			size: 40,
			header: () => <SummaryHeader label="E" bg="bg-[#1e40af]" />,
			cell: ({ row }) => computeStudentStats(row.original.statusByDate).excused,
		}),
		columnHelper.display({
			id: "pct",
			size: 64,
			header: () => <SummaryHeader label="% Asist." bg="bg-[#00123d]" />,
			cell: ({ row }) => {
				const stats = computeStudentStats(row.original.statusByDate);
				const color =
					stats.percentage < 80
						? "text-[#C62828] bg-[#fdeeee]"
						: stats.percentage < 90
							? "text-[#a06a00] bg-[#fdf6e6]"
							: "text-[#2E7D32] bg-[#eef6ee]";
				return (
					<span className={`inline-block rounded px-1.5 py-0.5 text-xs font-extrabold ${color}`}>
						{stats.percentage}%
					</span>
				);
			},
		}),
	];

	return [
		columnHelper.accessor("rollNumber", { header: "Nº", size: 34 }),
		columnHelper.accessor("fullName", {
			header: "Estudiante",
			size: 190,
			cell: ({ row }) => {
				const stats = computeStudentStats(row.original.statusByDate);
				return (
					<div className="flex items-center gap-2">
						<span>{row.original.fullName}</span>
						{stats.hasConsecutiveAbsenceAlert && (
							<Tooltip>
								<TooltipTrigger
									render={<span className="inline-block h-2 w-2 rounded-full bg-[#F9A825]" />}
								/>
								<TooltipContent>2+ ausencias consecutivas</TooltipContent>
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
				render={<span className="flex items-center justify-center text-[#b0b0b0]">{icon}</span>}
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
			? "bg-[#0288D1] text-white"
			: status === "nonInstructional"
				? "bg-[#94a3b8] text-white line-through"
				: "bg-[#003087] text-white";
	return (
		<div className={`rounded px-1 py-0.5 text-center ${cls}`}>
			<div className="text-[9px] uppercase leading-none">{dow}</div>
			<div className="text-[13px] font-bold leading-tight">{num}</div>
		</div>
	);
}

function SummaryHeader({ label, bg }: { label: string; bg: string }) {
	return <div className={`rounded px-1 py-0.5 text-center text-white ${bg}`}>{label}</div>;
}
