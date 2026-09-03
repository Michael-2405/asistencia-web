import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { StudentFormSheet } from "../components/StudentFormSheet";
import { WithdrawStudentDialog } from "../components/WithdrawStudentDialog";
import { useAllCourses, useStudents } from "../hooks";
import type { Student } from "../types";

type SortBy = "order" | "name";

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
			return `${a.firstLastname} ${a.firstName}`.localeCompare(
				`${b.firstLastname} ${b.firstName}`,
				"es",
			);
		}
		return a.orderNumber - b.orderNumber;
	});

	function openAdd() {
		setEditingStudent(undefined);
		setFormOpen(true);
	}

	function openEdit(student: Student) {
		setEditingStudent(student);
		setFormOpen(true);
	}

	return (
		<div>
			<div className="border-b border-[#E0E0E0] bg-white px-8 py-5.5">
				<div className="text-xs font-medium text-[#9a9a9a]">
					Mis Cursos → {course ? `${course.grade} ${course.section}` : "…"}
				</div>
				<div className="mt-1.5 flex flex-wrap items-start justify-between gap-3.5">
					<div>
						<div className="text-xl font-bold text-[#1a1a1a]">
							{course ? `${course.grade} Grado — Sección ${course.section}` : "Cargando…"}
						</div>
						<div className="mt-1 text-[13px] font-medium text-[#6b6b6b]">
							{course?.isHomeroom ? "Docente Encargado" : course?.subjectName} ·{" "}
							{course?.activeStudentCount ?? 0} estudiantes activos
						</div>
					</div>
					<Button className="bg-[#003087] hover:bg-[#002468]" onClick={openAdd}>
						+ Agregar Estudiante
					</Button>
				</div>
			</div>

			<div className="px-8 py-6">
				{sorted.length > 0 ? (
					<div className="overflow-hidden rounded-[10px] border border-[#E0E0E0] bg-white">
						<table className="w-full border-collapse text-[13px]">
							<thead>
								<tr className="bg-[#F5F5F5]">
									<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">
										Nº
									</th>
									<th
										onClick={() => setSortBy((s) => (s === "name" ? "order" : "name"))}
										className="cursor-pointer px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]"
									>
										Nombre completo {sortBy === "name" ? "↓" : ""}
									</th>
									<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">
										Fecha nacimiento
									</th>
									<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">
										Sexo
									</th>
									<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">
										Estado
									</th>
									<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody>
								{sorted.map((st) => (
									<tr
										key={st.id}
										className="border-t border-[#F0F0F0]"
										style={{ opacity: st.active ? 1 : 0.75 }}
									>
										<td className="px-3.5 py-2.5 text-[#6b6b6b]">{st.orderNumber}</td>
										<td
											className={`px-3.5 py-2.5 font-semibold ${st.active ? "text-[#1a1a1a]" : "text-[#9a9a9a]"}`}
										>
											{st.firstName} {st.secondName} {st.firstLastname} {st.secondLastname}
										</td>
										<td
											className={`px-3.5 py-2.5 ${st.active ? "text-[#1a1a1a]" : "text-[#9a9a9a]"}`}
										>
											{st.birthDate ?? "—"}
										</td>
										<td
											className={`px-3.5 py-2.5 ${st.active ? "text-[#1a1a1a]" : "text-[#9a9a9a]"}`}
										>
											{st.sex ?? "—"}
										</td>
										<td className="px-3.5 py-2.5">
											<span
												className={`whitespace-nowrap rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
													st.active ? "bg-[#eef6ee] text-[#2E7D32]" : "bg-[#F0F0F0] text-[#8a8a8a]"
												}`}
											>
												{st.active ? "Activo" : `Retirado (${st.withdrawalDate})`}
											</span>
										</td>
										<td className="px-3.5 py-2.5">
											<div className="flex gap-2.5">
												<button
													type="button"
													onClick={() => openEdit(st)}
													className="p-0 text-xs font-semibold text-[#003087]"
												>
													Editar
												</button>
												{st.active && (
													<button
														type="button"
														onClick={() => setWithdrawTarget(st)}
														className="p-0 text-xs font-semibold text-[#C62828]"
													>
														Registrar retiro
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="rounded-[10px] border border-[#E0E0E0] bg-white py-17.5 text-center">
						<div className="text-[15px] font-semibold text-[#1a1a1a]">
							Este curso no tiene estudiantes aún
						</div>
						<Button className="mt-4 bg-[#003087] hover:bg-[#002468]" onClick={openAdd}>
							+ Agregar primer estudiante
						</Button>
					</div>
				)}
			</div>

			<StudentFormSheet
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
