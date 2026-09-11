import { useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { Course } from "../../types";

interface CourseCardProps {
	course: Course;
	attendanceSubmitted: boolean | null;
	onEdit: () => void;
	onDeactivate: () => void;
}

export function CourseCard({ course, attendanceSubmitted, onEdit, onDeactivate }: CourseCardProps) {
	const navigate = useNavigate();
	const barColor = course.educationLevel === "PRIMARY" ? "bg-[#003087]" : "bg-[#1B5E20]";
	const levelTagStyle =
		course.educationLevel === "PRIMARY"
			? "bg-[#E8EEF9] text-[#003087]"
			: "bg-[#E6F0E7] text-[#1B5E20]";
	const subjectLabel = course.isHomeroom
		? "Docente de Aula"
		: (course.subjectName ?? "Sin materia");

	return (
		<div className="flex overflow-hidden rounded-[11px] border border-[#E0E0E0] bg-white">
			<div className={`w-1.5 shrink-0 ${barColor}`} />
			<div className="flex flex-1 flex-col gap-3 p-4.5">
				<div className="flex items-start justify-between gap-2.5">
					<div>
						<div className="text-[15.5px] font-extrabold text-[#1a1d21]">
							{course.grade} Grado — Sección {course.section}
						</div>
						<div className="mt-0.5 text-[13px] text-[#5b5f66]">
							{subjectLabel} · {course.activeStudentCount} estudiantes activos
						</div>
					</div>
					<div className="flex items-center gap-1.5">
						<span
							className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[10.5px] font-bold ${levelTagStyle}`}
						>
							{course.educationLevel === "PRIMARY" ? "Primario" : "Secundario"}
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<button type="button" className="px-1.5 py-0.5 text-base text-[#8a8f98]">
										⋯
									</button>
								}
							/>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
								<DropdownMenuItem onClick={onDeactivate} className="text-[#C62828]">
									Desactivar
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{attendanceSubmitted !== null && (
					<span
						className={`w-fit rounded-md px-2.5 py-1 text-xs font-bold ${
							attendanceSubmitted ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFF1DE] text-[#E65100]"
						}`}
					>
						{attendanceSubmitted ? "Registrada ✓" : "Pendiente ⚠"}
					</span>
				)}

				<div className="mt-0.5 flex gap-2">
					<button
						type="button"
						onClick={() => navigate(`/courses/${course.id}/attendance`)}
						className="flex-1 rounded-[7px] bg-[#003087] py-2 text-[12.5px] font-bold text-white"
					>
						Pasar lista
					</button>
					<button
						type="button"
						onClick={() => navigate(`/courses/${course.id}/students`)}
						className="flex-1 rounded-[7px] border-[1.5px] border-[#003087] py-2 text-[12.5px] font-bold text-[#003087]"
					>
						Estudiantes
					</button>
				</div>
			</div>
		</div>
	);
}
