import { createColumnHelper } from "@tanstack/react-table";
import { Ban, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import type { AttendanceStatusCode, CalendarDay, StudentAttendanceRow } from "../types";
import { computeStudentTotals, getDayStatus } from "../utils";
import { StatusBadge } from "./StatusBadge";
import { StatusSelector } from "./StatusSelector";

const columnHelper = createColumnHelper<StudentAttendanceRow>();

interface BuildColumnsParams {
	calendarDays: CalendarDay[];
	todayIso: string;
	edits: Record<string, AttendanceStatusCode>;
	onStatusChange: (enrollmentId: string, status: AttendanceStatusCode) => void;
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
			size: status === "today" ? 88 : 56,
			header: () => <DayHeader date={date} status={status} />,
			cell: ({ row }) => {
				const enrollmentId = row.original.enrollmentId;

				if (isEditableToday) {
					return (
						<StatusSelector
							value={edits[enrollmentId] ?? "P"}
							onChange={(newStatus) => onStatusChange(enrollmentId, newStatus)}
						/>
					);
				}

				if (status === "nonInstructional") {
					return <BlockedIndicator icon={<Ban className="size-3.5" />} tooltip="No laborable" />;
				}

				if (status === "past" || status === "future") {
					const savedStatus = row.original.statusByDate[date] as AttendanceStatusCode | undefined;
					if (savedStatus) return <StatusBadge status={savedStatus} />;

					return (
						<BlockedIndicator
							icon={<Lock className="size-3.5" />}
							tooltip={status === "past" ? "Fecha pasada" : "Fecha futura"}
						/>
					);
				}

				const savedStatus = row.original.statusByDate[date] as AttendanceStatusCode | undefined;
				return <StatusBadge status={savedStatus ?? null} />;
			},
		});
	});

	const totalsColumns = [
		columnHelper.display({
			id: "totalPresent",
			size: 56,
			header: () => <TotalHeader label="Pres." colorClass="bg-green-600" />,
			cell: ({ row }) => computeStudentTotals(row.original.statusByDate).present,
		}),
		columnHelper.display({
			id: "totalAbsent",
			size: 56,
			header: () => <TotalHeader label="Aus." colorClass="bg-red-600" />,
			cell: ({ row }) => computeStudentTotals(row.original.statusByDate).absent,
		}),
		columnHelper.display({
			id: "totalLate",
			size: 56,
			header: () => <TotalHeader label="Tar." colorClass="bg-amber-600" />,
			cell: ({ row }) => computeStudentTotals(row.original.statusByDate).late,
		}),
		columnHelper.display({
			id: "totalExcused",
			size: 56,
			header: () => <TotalHeader label="Exc." colorClass="bg-blue-600" />,
			cell: ({ row }) => computeStudentTotals(row.original.statusByDate).excused,
		}),
	];

	return [
		columnHelper.accessor("rollNumber", { header: "#", size: 40 }),
		columnHelper.accessor("fullName", { header: "Estudiante", size: 180 }),
		...dayColumns,
		...totalsColumns,
	];
}

function BlockedIndicator({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<span className="flex items-center justify-center text-muted-foreground">{icon}</span>
				}
			/>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	);
}

function DayHeader({ date, status }: { date: string; status: ReturnType<typeof getDayStatus> }) {
	const parsedDate = new Date(`${date}T00:00:00`);
	const weekday = parsedDate.toLocaleDateString("es-DO", { weekday: "short" });
	const dayNumber = parsedDate.getDate();

	const headerClass =
		status === "today"
			? "bg-green-600 text-white"
			: status === "nonInstructional"
				? "bg-slate-200 text-slate-500 line-through"
				: "";

	return (
		<div className={`rounded px-1 py-0.5 text-center ${headerClass}`}>
			<div className="text-[10px] uppercase leading-none">{weekday}</div>
			<div className="text-sm font-semibold leading-tight">{dayNumber}</div>
		</div>
	);
}

function TotalHeader({ label, colorClass }: { label: string; colorClass: string }) {
	return <div className={`rounded px-1 py-0.5 text-center text-white ${colorClass}`}>{label}</div>;
}
