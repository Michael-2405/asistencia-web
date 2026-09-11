import { useNavigate } from "react-router-dom";
import type { Course } from "@/features/courses/types";

interface CourseSummaryCardProps {
	course: Course;
	attendanceSubmitted: boolean | null;
}

export function CourseSummaryCard({ course, attendanceSubmitted }: CourseSummaryCardProps) {
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
						<div className="text-[15.5px] font-extrabold text-[#1a1d21]">{subjectLabel}</div>
						<div className="mt-0.5 text-[13px] text-[#5b5f66]">
							{course.grade} Grado — Sección {course.section} · {course.activeStudentCount}{" "}
							estudiantes
						</div>
					</div>
					<span
						className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[10.5px] font-bold ${levelTagStyle}`}
					>
						{course.educationLevel === "PRIMARY" ? "Primario" : "Secundario"}
					</span>
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
						Asistencia
					</button>
					<button
						type="button"
						disabled
						title="Próximamente — módulo de calificaciones en desarrollo"
						className="flex-1 cursor-not-allowed rounded-[7px] border-[1.5px] border-[#a8b5d6] py-2 text-[12.5px] font-bold text-[#a8b5d6]"
					>
						Calificaciones
					</button>
				</div>
			</div>
		</div>
	);
}
