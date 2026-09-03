import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { Course } from "../types";

interface CourseCardProps {
	course: Course;
	onEdit: () => void;
	onDelete: () => void;
	onViewStudents: () => void;
}

export function CourseCard({ course, onEdit, onDelete, onViewStudents }: CourseCardProps) {
	return (
		<div className="flex flex-col gap-3 rounded-xl border border-[#E0E0E0] bg-white p-5">
			<div className="flex items-start justify-between">
				<span
					className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wide ${
						course.educationLevel === "PRIMARY"
							? "bg-[#eef3fb] text-[#003087]"
							: "bg-[#e6f0e6] text-[#1B5E20]"
					}`}
				>
					{course.educationLevel === "PRIMARY" ? "PRIMARIO" : "SECUNDARIO"}
				</span>
			</div>

			<div>
				<div className="text-[17px] font-bold text-[#1a1a1a]">
					{course.grade} Grado — Sección {course.section}
				</div>
				<div className="mt-0.5 text-[13px] font-medium text-[#6b6b6b]">
					{course.isHomeroom ? "Docente encargado" : (course.subjectName ?? "Sin materia")}
				</div>
			</div>

			<div className="flex items-center justify-between border-t border-[#F0F0F0] pt-3 text-xs font-medium text-[#6b6b6b]">
				<span>
					{course.activeStudentCount} activos
					{course.inactiveStudentCount > 0 ? ` · ${course.inactiveStudentCount} inactivos` : ""}
				</span>
			</div>

			<div className="mt-0.5 flex gap-2">
				<button
					type="button"
					disabled
					title="Próximamente — módulo de asistencia en construcción"
					className="flex-1 cursor-not-allowed rounded-lg bg-[#a9b8d9] py-2.5 text-xs font-bold text-white"
				>
					Pasar lista
				</button>
				<button
					type="button"
					onClick={onViewStudents}
					className="flex-1 rounded-lg border-[1.5px] border-[#E0E0E0] py-2.5 text-xs font-semibold text-[#003087]"
				>
					Estudiantes
				</button>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<button
								type="button"
								className="rounded-lg border-[1.5px] border-[#E0E0E0] px-3 text-sm font-bold text-[#6b6b6b]"
							>
								⋯
							</button>
						}
					/>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
						<DropdownMenuItem onClick={onDelete} className="text-[#C62828]">
							Eliminar curso
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
