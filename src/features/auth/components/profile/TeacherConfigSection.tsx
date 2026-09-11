interface TeacherConfigSectionProps {
	educationLevel: "PRIMARY" | "SECONDARY";
	isHomeroomTeacher: boolean;
	subjectName: string | null;
}

export function TeacherConfigSection({
	educationLevel,
	isHomeroomTeacher,
	subjectName,
}: TeacherConfigSectionProps) {
	const levelLabel = educationLevel === "PRIMARY" ? "Nivel Primario" : "Nivel Secundario";
	const typeLabel =
		educationLevel === "SECONDARY"
			? "Docente de asignatura"
			: isHomeroomTeacher
				? "Encargado de sección"
				: "Docente de área";
	const typeBadgeStyle = isHomeroomTeacher
		? "bg-[#E6F0E7] text-[#1B5E20]"
		: "bg-[#E8EEF9] text-[#003087]";
	const subjectLabel = isHomeroomTeacher
		? "Materias troncales"
		: (subjectName ?? "Sin materia asignada");

	return (
		<div className="flex flex-col gap-4 rounded-[11px] border border-[#E0E0E0] bg-white p-6">
			<h2 className="text-base font-extrabold text-[#1a1d21]">Configuración docente</h2>

			<div className="flex items-center justify-between">
				<span className="text-[13.5px] text-[#5b5f66]">Nivel educativo</span>
				<span className="rounded-md bg-[#E8EEF9] px-3 py-1.5 text-xs font-bold text-[#003087]">
					{levelLabel}
				</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-[13.5px] text-[#5b5f66]">Tipo de docente</span>
				<span className={`rounded-md px-3 py-1.5 text-xs font-bold ${typeBadgeStyle}`}>
					{typeLabel}
				</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-[13.5px] text-[#5b5f66]">Materia que imparte</span>
				<span className="rounded-md bg-[#F5F5F5] px-3 py-1.5 text-xs font-bold text-[#5b5f66]">
					{subjectLabel}
				</span>
			</div>
		</div>
	);
}
