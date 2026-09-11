import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAllCourses } from "@/features/courses/hooks";
import { Button } from "@/shared/ui/button";
import { StudentFormDialog } from "../components/StudentFormDialog";
import { WithdrawStudentDialog } from "../components/WithdrawStudentDialog";
import { useStudents } from "../hooks";
import type { Student } from "../types";

type SortBy = "order" | "name";

function formatBirthDate(isoDate: string | null): string {
	if (!isoDate) return "—";
	const [year, month, day] = isoDate.split("-");
	return `${day}/${month}/${year}`;
}

export function StudentsListPage() {
	const { courseId } = useParams<{ courseId: string }>();
	const { data: students } = useStudents(courseId ?? "");
	const { data: courses } = useAllCourses();
	const course = (courses ?? []).find((c) => c.id === courseId);

	const [sortBy, setSortBy] = useState<SortBy>("order");
	const [formOpen, setFormOpen] = useState(false);
	const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
	const [withdrawTarget, setWithdrawTarget] = useState<Student | undefined>(undefined);

	if (!courseId) return null;

	const sorted = [...(students ?? [])].sort((a, b) => {
		if (sortBy === "name") {
			if (a.active !== b.active) return a.active ? -1 : 1;
			return `${a.firstLastname} ${a.firstName}`.localeCompare(
				`${b.firstLastname} ${b.firstName}`,
				"es",
			);
		}
		return a.orderNumber - b.orderNumber;
	});

	const activeCount = (students ?? []).filter((s) => s.active).length;

	function openAdd() {
		setEditingStudent(undefined);
		setFormOpen(true);
	}

	function openEdit(student: Student) {
		setEditingStudent(student);
		setFormOpen(true);
	}

	return (
		<div className="mx-auto flex max-w-245 flex-col gap-4.5 p-8">
			<div className="text-[12.5px] text-[#8a8f98]">
				Mis Cursos <span className="mx-1">→</span>
				<span className="font-semibold text-[#1a1d21]">
					{course ? `${course.grade} ${course.section}` : "…"}
				</span>
			</div>

			<div className="flex flex-wrap items-start justify-between gap-3.5">
				<div>
					<h1 className="mb-1 text-2xl font-extrabold text-[#1a1d21]">
						{course ? `${course.grade} Grado — Sección ${course.section}` : "Cargando…"}
					</h1>
					<span className="text-[13.5px] text-[#5b5f66]">
						{course?.isHomeroom ? "Docente Encargado" : course?.subjectName} · {activeCount}{" "}
						estudiantes activos
					</span>
				</div>
				<Button className="bg-[#003087] hover:bg-[#002468]" onClick={openAdd}>
					+ Agregar Estudiante
				</Button>
			</div>

			{sorted.length > 0 ? (
				<div className="overflow-hidden rounded-[10px] border border-[#E0E0E0] bg-white">
					<table className="w-full border-collapse text-[13px]">
						<thead>
							<tr className="bg-[#F5F5F5]">
								<th className="px-3.5 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-wide text-[#5b5f66]">
									Nº
								</th>
								<th
									onClick={() => setSortBy((s) => (s === "name" ? "order" : "name"))}
									className="cursor-pointer px-3.5 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-wide text-[#5b5f66]"
								>
									Nombre completo {sortBy === "name" ? "↓" : ""}
								</th>
								<th className="px-3.5 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-wide text-[#5b5f66]">
									F. nacimiento
								</th>
								<th className="px-3.5 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-wide text-[#5b5f66]">
									Sexo
								</th>
								<th className="px-3.5 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-wide text-[#5b5f66]">
									Estado
								</th>
								<th className="px-3.5 py-2.5 text-right text-[11px] font-extrabold uppercase tracking-wide text-[#5b5f66]">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody>
							{sorted.map((st) => (
								<tr
									key={st.id}
									className="border-b border-[#F0F0F0] last:border-b-0"
									style={{ opacity: st.active ? 1 : 0.6 }}
								>
									<td className="px-3.5 py-2.5 font-semibold text-[#a8adb5]">{st.orderNumber}</td>
									<td
										className={`px-3.5 py-2.5 font-semibold ${st.active ? "text-[#1a1d21]" : "text-[#8a8f98]"}`}
									>
										{st.firstName} {st.secondName} {st.firstLastname} {st.secondLastname}
									</td>
									<td className="px-3.5 py-2.5 text-[#5b5f66]">{formatBirthDate(st.birthDate)}</td>
									<td className="px-3.5 py-2.5 text-[#5b5f66]">
										{st.sex === "M" ? "Masculino" : st.sex === "F" ? "Femenino" : "—"}
									</td>
									<td className="px-3.5 py-2.5">
										<span
											className={`whitespace-nowrap rounded-md px-2.5 py-0.5 text-[11.5px] font-bold ${
												st.active ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#F5F5F5] text-[#8a8f98]"
											}`}
										>
											{st.active ? "Activo" : `Retirado · ${st.withdrawalDate}`}
										</span>
									</td>
									<td className="whitespace-nowrap px-3.5 py-2.5 text-right">
										<button
											type="button"
											onClick={() => openEdit(st)}
											className="px-1.5 text-[12.5px] font-bold text-[#003087]"
										>
											Editar
										</button>
										{st.active && (
											<button
												type="button"
												onClick={() => setWithdrawTarget(st)}
												className="px-1.5 text-[12.5px] font-bold text-[#C62828]"
											>
												Registrar retiro
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="rounded-[10px] border border-[#E0E0E0] bg-white py-17.5 text-center">
					<div className="text-[15px] font-semibold text-[#1a1d21]">
						Este curso no tiene estudiantes aún
					</div>
					<Button className="mt-4 bg-[#003087] hover:bg-[#002468]" onClick={openAdd}>
						+ Agregar primer estudiante
					</Button>
				</div>
			)}

			<StudentFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				courseId={courseId}
				student={editingStudent}
				onWithdrawRequest={
					editingStudent
						? () => {
								setFormOpen(false);
								setWithdrawTarget(editingStudent);
							}
						: undefined
				}
			/>

			{withdrawTarget && (
				<WithdrawStudentDialog
					open={Boolean(withdrawTarget)}
					onOpenChange={(v) => !v && setWithdrawTarget(undefined)}
					courseId={courseId}
					student={withdrawTarget}
				/>
			)}
		</div>
	);
}
