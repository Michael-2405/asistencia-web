import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import {
	useMonthlyAttendance,
	useSaveDailyAttendance,
	useTodayEdits,
} from "@/features/attendance/hooks";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { formatMonthYear, getTodayIso } from "../utils";
import { buildAttendanceColumns } from "./AttendanceGrid.columns";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceLegend } from "./AttendanceLegend";
import { MarkNonInstructionalDayDialog } from "./MarkNonInstructionalDayDialog";

const logger = createLogger("AttendanceGrid");

interface AttendanceGridProps {
	sectionId: string;
	schoolYearId: string;
	year: number;
	month: number;
}

export function AttendanceGrid({ sectionId, schoolYearId, year, month }: AttendanceGridProps) {
	const todayIso = getTodayIso();
	const { data, isLoading, isError } = useMonthlyAttendance(sectionId, year, month);

	const sectionLabel = data?.section ? `${data.section.grade} ${data.section.name}` : "—";
	const monthLabel = formatMonthYear(year, month);

	const saveMutation = useSaveDailyAttendance(sectionId, year, month);

	const rows = data?.rows ?? [];
	const calendarDays = data?.calendarDays ?? [];
	const instructionalDaysCount = calendarDays.filter((d) => !d.nonInstructional).length;

	const todayCalendarDay = calendarDays.find((d) => d.date === todayIso);
	const isTodayEditable = Boolean(todayCalendarDay) && !todayCalendarDay?.nonInstructional;

	const { edits, setStatus } = useTodayEdits(rows, todayIso);

	const isTodaySubmitted = useMemo(
		() => rows.some((row) => row.statusByDate[todayIso] !== undefined),
		[rows, todayIso],
	);

	const columns = useMemo(
		() =>
			buildAttendanceColumns({
				calendarDays,
				todayIso,
				edits,
				onStatusChange: setStatus,
				isTodaySubmitted,
			}),
		[calendarDays, todayIso, edits, setStatus, isTodaySubmitted],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const dailyTotals = useMemo(() => {
		return calendarDays.map(({ date, nonInstructional }) =>
			nonInstructional
				? null
				: rows.reduce((count, row) => (row.statusByDate[date] === "P" ? count + 1 : count), 0),
		);
	}, [calendarDays, rows]);

	function handleSaveToday() {
		const records = rows.map((row) => ({
			enrollmentId: row.enrollmentId,
			status: edits[row.enrollmentId] ?? "P",
		}));

		logger.info("Submitting today attendance", { date: todayIso, count: records.length });
		saveMutation.mutate({ date: todayIso, records });
	}

	if (isLoading) return <p className="text-muted-foreground">Cargando asistencia…</p>;
	if (isError) return <p className="text-destructive">No se pudo cargar la asistencia del mes.</p>;

	return (
		<div className="space-y-3">
			<AttendanceHeader
				sectionLabel={sectionLabel}
				monthLabel={monthLabel}
				instructionalDaysCount={instructionalDaysCount}
			/>

			<div className="flex justify-end">
				<MarkNonInstructionalDayDialog
					sectionId={sectionId}
					schoolYearId={schoolYearId}
					year={year}
					month={month}
				/>
			</div>

			<div className="overflow-x-auto rounded-lg border">
				<table className="w-full border-collapse text-sm table-fixed">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="bg-slate-100">
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										style={{ width: header.getSize() }}
										className="border px-2 py-1 text-left font-medium"
									>
										{flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="even:bg-slate-50">
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										style={{ width: cell.column.getSize() }}
										className={`border px-2 py-1 text-center ${
											cell.column.id === "fullName" ? "whitespace-nowrap text-left" : ""
										}`}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr className="bg-slate-100 font-medium">
							<td className="border px-2 py-1" colSpan={2}>
								Total presentes
							</td>
							{dailyTotals.map((total, index) => (
								<td key={calendarDays[index].date} className="border px-2 py-1 text-center">
									{total ?? "–"}
								</td>
							))}
						</tr>
					</tfoot>
				</table>
			</div>

			{isTodayEditable && !isTodaySubmitted && (
				<Button onClick={handleSaveToday} disabled={saveMutation.isPending}>
					{saveMutation.isPending ? "Guardando…" : "Guardar asistencia de hoy"}
				</Button>
			)}

			{isTodayEditable && isTodaySubmitted && (
				<p className="text-sm text-muted-foreground">La asistencia de hoy ya fue registrada.</p>
			)}

			<AttendanceLegend />
		</div>
	);
}
