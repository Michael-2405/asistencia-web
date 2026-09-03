import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useCourse, useStudents } from "@/features/courses/hooks";
import { Button } from "@/shared/ui/button";
import { useMonthlyAttendance, useSaveDailyAttendance } from "../hooks";
import type { AttendanceStatusCode } from "../types";
import { getTodayIso } from "../utils";
import { buildAttendanceColumns } from "./AttendanceGrid.columns";
import { AttendanceHeader } from "./AttendanceHeader";
import { MarkNonInstructionalDayDialog } from "./MarkNonInstructionalDayDialog";

interface AttendanceGridProps {
	courseId: string;
	year: number;
	month: number;
	monthOptions: { year: number; month: number; label: string }[];
	onMonthChange: (year: number, month: number) => void;
}

export function AttendanceGrid({
	courseId,
	year,
	month,
	monthOptions,
	onMonthChange,
}: AttendanceGridProps) {
	const todayIso = getTodayIso();
	const { data: students } = useStudents(courseId);
	const activeStudents = useMemo(
		() =>
			(students ?? [])
				.filter((s) => s.active)
				.map((s) => ({
					id: s.id,
					rollNumber: s.orderNumber,
					fullName: `${s.firstLastname}, ${s.firstName}`,
				})),
		[students],
	);

	const { data, isLoading } = useMonthlyAttendance(courseId, year, month, activeStudents);
	const saveMutation = useSaveDailyAttendance(courseId, year, month);
	const [markDayOpen, setMarkDayOpen] = useState(false);
	const [edits, setEdits] = useState<Record<string, AttendanceStatusCode>>({});

	const rows = data?.rows ?? [];
	const calendarDays = data?.calendarDays ?? [];
	const todayCalendarDay = calendarDays.find((d) => d.date === todayIso);
	const isTodayEditable = Boolean(todayCalendarDay) && !todayCalendarDay?.nonInstructional;
	const isTodaySubmitted = useMemo(
		() => rows.some((r) => r.statusByDate[todayIso] !== undefined),
		[rows, todayIso],
	);

	const setStatus = useCallback((studentId: string, status: AttendanceStatusCode) => {
		setEdits((prev) => ({ ...prev, [studentId]: status }));
	}, []);

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

	const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

	const course = useCourse(courseId);
	const courseLabel = course
		? `${course.grade} Grado — Sección ${course.section}${course.isHomeroom ? "" : ` · ${course.subjectName ?? ""}`}`
		: "Cargando…";
	const workingDaysCount = calendarDays.filter((d) => !d.nonInstructional).length;

	async function handleSave() {
		const records = rows.map((r) => ({
			studentId: r.studentId,
			status: edits[r.studentId] ?? ("P" as AttendanceStatusCode),
		}));
		await saveMutation.mutateAsync({ date: todayIso, records });
	}

	if (isLoading) return <p className="p-6 text-muted-foreground">Cargando…</p>;

	return (
		<div>
			<AttendanceHeader
				courseLabel={courseLabel}
				workingDaysCount={workingDaysCount}
				monthOptions={monthOptions}
				onMonthChange={onMonthChange}
				selectedYear={year}
				selectedMonth={month}
			/>
			<div className="flex items-center justify-between border-b border-[#E0E0E0] bg-white px-6 py-4">
				<div className="flex items-center gap-3">
					{isTodayEditable && !isTodaySubmitted && (
						<Button
							onClick={handleSave}
							disabled={saveMutation.isPending}
							className="bg-[#003087] hover:bg-[#002468]"
						>
							{saveMutation.isPending ? "Guardando…" : "Guardar"}
						</Button>
					)}
					{isTodayEditable && isTodaySubmitted && (
						<span className="text-xs font-medium text-[#6b6b6b]">
							La asistencia de hoy ya fue registrada.
						</span>
					)}
				</div>
				<Button
					variant="outline"
					className="border-[1.5px] border-[#003087] text-[#003087]"
					onClick={() => setMarkDayOpen(true)}
				>
					Marcar día no laborable
				</Button>
			</div>

			<div className="overflow-x-auto p-6">
				<table className="w-full border-separate border-spacing-1 text-sm">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((h) => (
									<th
										key={h.id}
										style={{ width: h.getSize() }}
										className="px-1 py-1 text-center font-medium"
									>
										{flexRender(h.column.columnDef.header, h.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										style={{ width: cell.column.getSize() }}
										className={`rounded border border-[#E0E0E0] bg-white px-1 py-1.5 text-center ${
											cell.column.id === "fullName" ? "whitespace-nowrap text-left" : ""
										}`}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-wrap gap-4 px-6 pb-6 text-[11px] font-medium text-[#6b6b6b]">
				<div>
					<b className="text-[#2E7D32]">P</b> Presente
				</div>
				<div>
					<b className="text-[#a06a00]">T</b> Tardanza
				</div>
				<div>
					<b className="text-[#C62828]">A</b> Ausente
				</div>
				<div>
					<b className="text-[#0277a8]">E</b> Excusa
				</div>
				<div className="flex items-center gap-1.5">
					<span className="inline-block h-2 w-2 rounded-full bg-[#F9A825]" /> 2+ ausencias
					consecutivas
				</div>
			</div>

			<MarkNonInstructionalDayDialog
				courseId={courseId}
				year={year}
				month={month}
				open={markDayOpen}
				onOpenChange={setMarkDayOpen}
			/>
		</div>
	);
}
