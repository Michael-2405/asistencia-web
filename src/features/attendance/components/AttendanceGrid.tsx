import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useCourse } from "@/features/courses/hooks";
import { useMonthlyAttendance, useSaveDailyAttendance } from "../hooks";
import type { AttendanceStatusCode } from "../types";
import { getTodayIso } from "../utils";
import { buildAttendanceColumns } from "./AttendanceGrid.columns";
import { AttendanceInfoCard } from "./AttendanceInfoCard";
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
	const course = useCourse(courseId);
	const { data, isLoading } = useMonthlyAttendance(courseId, year, month);
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

	const activeRows = rows.filter((r) => r.active);
	const footerTotals = { P: 0, T: 0, A: 0, E: 0 };
	activeRows.forEach((r) => {
		for (const v of Object.values(r.statusByDate)) {
			if (v in footerTotals) footerTotals[v as keyof typeof footerTotals]++;
		}
	});
	const dailyPresentCounts = calendarDays.map((d) =>
		d.nonInstructional ? null : activeRows.filter((r) => r.statusByDate[d.date] === "P").length,
	);

	async function handleSave() {
		const eligibleStudents = rows.filter(
			(r) => r.active || !r.withdrawalDate || r.withdrawalDate > todayIso,
		);
		const records = eligibleStudents.map((r) => ({
			studentId: r.studentId,
			status: edits[r.studentId] ?? ("P" as AttendanceStatusCode),
		}));
		await saveMutation.mutateAsync({ date: todayIso, records });
	}

	const courseLabel = course
		? `${course.grade} ${course.section} — ${course.educationLevel === "PRIMARY" ? "Primaria" : "Secundaria"}`
		: "Cargando…";

	const studentCountLabel = course
		? `${course.isHomeroom ? "Sección única" : (course.subjectName ?? "Sin materia")} · ${course.activeStudentCount} estudiantes`
		: "";

	const workingDaysCount = calendarDays.filter((d) => !d.nonInstructional).length;

	if (isLoading) return <p className="p-6 text-muted-foreground">Cargando…</p>;

	return (
		<div className="flex flex-col gap-4 p-8">
			<AttendanceInfoCard
				courseLabel={courseLabel}
				studentCountLabel={studentCountLabel}
				workingDaysCount={workingDaysCount}
				totalDaysCount={calendarDays.length}
				monthOptions={monthOptions}
				selectedYear={year}
				selectedMonth={month}
				onMonthChange={onMonthChange}
				isTodaySubmitted={isTodaySubmitted}
				canSave={isTodayEditable}
				saving={saveMutation.isPending}
				onSave={handleSave}
				onMarkNonInstructionalDay={() => setMarkDayOpen(true)}
			/>

			<div className="overflow-hidden rounded-[10px] border border-[#E0E0E0] bg-white">
				<div className="max-h-160 overflow-auto">
					<table className="w-full min-w-max border-separate border-spacing-0 text-[12.5px]">
						<thead>
							{table.getHeaderGroups().map((hg) => (
								<tr key={hg.id}>
									{hg.headers.map((h, i) => (
										<th
											key={h.id}
											style={{ width: h.getSize() }}
											className={`sticky top-0 z-20 bg-[#003087] px-1.5 py-2 text-center font-bold text-white ${i === 1 ? "sticky left-0 z-30 text-left" : ""}`}
										>
											{flexRender(h.column.columnDef.header, h.getContext())}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row, rowIndex) => (
								<tr key={row.id} className={rowIndex % 2 === 1 ? "bg-[#FBFBFC]" : "bg-white"}>
									{row.getVisibleCells().map((cell, i) => (
										<td
											key={cell.id}
											style={{ width: cell.column.getSize() }}
											className={`border-b border-r border-[#F0F0F0] px-1 py-1.5 text-center ${
												i === 1
													? "sticky left-0 z-10 whitespace-nowrap bg-inherit px-3.5 text-left"
													: ""
											}`}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr className="bg-[#EDEFF2] font-extrabold text-[#1a1d21]">
								<td
									colSpan={2}
									className="sticky left-0 z-10 border-t-2 border-[#d5d8dc] bg-[#EDEFF2] px-3.5 py-2.5 text-left text-xs"
								>
									Total de la sección
								</td>
								{dailyPresentCounts.map((count, i) => (
									<td
										key={calendarDays[i]?.date ?? i}
										className="border-t-2 border-[#d5d8dc] py-2.5 text-center text-[11.5px] text-[#5b5f66]"
									>
										{count ?? "—"}
									</td>
								))}
								<td className="border-t-2 border-l-2 border-[#d5d8dc] bg-[#dbe4f5] py-2.5 text-center text-[#003087]">
									{footerTotals.P}
								</td>
								<td className="border-t-2 border-[#d5d8dc] bg-[#dbe4f5] py-2.5 text-center text-[#003087]">
									{footerTotals.T}
								</td>
								<td className="border-t-2 border-[#d5d8dc] bg-[#dbe4f5] py-2.5 text-center text-[#003087]">
									{footerTotals.A}
								</td>
								<td className="border-t-2 border-[#d5d8dc] bg-[#dbe4f5] py-2.5 text-center text-[#003087]">
									{footerTotals.E}
								</td>
								<td className="border-t-2 border-[#d5d8dc] bg-[#dbe4f5]" />
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-4 px-1 text-xs text-[#5b5f66]">
				<span className="font-bold text-[#1a1d21]">Leyenda:</span>
				<LegendItem color="#E8F5E9" border="#2E7D32" label="Presente" />
				<LegendItem color="#FFF8E1" border="#F9A825" label="Tardanza" />
				<LegendItem color="#FDECEA" border="#C62828" label="Ausente" />
				<LegendItem color="#E1F5FE" border="#0288D1" label="Excusa" />
				<span className="flex items-center gap-1.5">
					<span className="inline-block h-3.5 w-3.5 rounded border border-[#c9ccd1] bg-[repeating-linear-gradient(45deg,#e6e6e6,#e6e6e6_4px,#f2f2f2_4px,#f2f2f2_8px)]" />
					Feriado / no laborable
				</span>
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

function LegendItem({ color, border, label }: { color: string; border: string; label: string }) {
	return (
		<span className="flex items-center gap-1.5">
			<span
				className="inline-block h-3.5 w-3.5 rounded border"
				style={{ backgroundColor: color, borderColor: border }}
			/>
			{label}
		</span>
	);
}
