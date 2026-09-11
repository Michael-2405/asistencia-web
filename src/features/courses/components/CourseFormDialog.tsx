import { useEffect, useState } from "react";
import { useSubjects } from "@/features/academic/hooks";
import { StatusBanner } from "@/features/auth/components/shared/StatusBanner";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useCourses, useCreateCourse, useUpdateCourse } from "../hooks";
import type { Course } from "../types";
import { HomeroomToggle } from "./course-form/HomeroomToggle";
import { PillSelector } from "./course-form/PillSelector";

const GRADES = ["1ro", "2do", "3ro", "4to", "5to", "6to"] as const;
const SECTIONS = ["A", "B", "C", "D", "E"] as const;
const LEVELS = ["PRIMARY", "SECONDARY"] as const;

interface CourseFormDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	schoolYearId: string;
	course?: Course;
}

export function CourseFormDialog({
	open,
	onOpenChange,
	schoolYearId,
	course,
}: CourseFormDialogProps) {
	const isEditing = Boolean(course);
	const { data: subjects } = useSubjects();
	const { data: existingCourses } = useCourses(schoolYearId);
	const createMutation = useCreateCourse();
	const updateMutation = useUpdateCourse(course?.id ?? "");
	const [submitting, setSubmitting] = useState(false);

	const [grade, setGrade] = useState(course?.grade ?? "1ro");
	const [section, setSection] = useState(course?.section ?? "A");
	const [educationLevel, setEducationLevel] = useState<"PRIMARY" | "SECONDARY">(
		course?.educationLevel ?? "PRIMARY",
	);
	const [isHomeroom, setIsHomeroom] = useState(course?.isHomeroom ?? true);
	const [subjectId, setSubjectId] = useState<string | undefined>(course?.subjectId ?? undefined);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setGrade(course?.grade ?? "1ro");
			setSection(course?.section ?? "A");
			setEducationLevel(course?.educationLevel ?? "PRIMARY");
			setIsHomeroom(course?.isHomeroom ?? true);
			setSubjectId(course?.subjectId ?? undefined);
			setError(null);
			setSubmitting(false);
		}
	}, [open, course]);

	const filteredSubjects = (subjects ?? []).filter(
		(s) => s.level === educationLevel || s.level === "BOTH",
	);

	const isDuplicate = (existingCourses ?? []).some(
		(c) =>
			c.id !== course?.id &&
			c.grade === grade &&
			c.section === section &&
			(c.subjectId ?? null) === (subjectId ?? null),
	);

	const autoInfoText = isHomeroom
		? "Nivel Primario — Docente Encargado · Lengua Española, Matemáticas, Ciencias Sociales, Ciencias Naturales"
		: `Nivel ${educationLevel === "PRIMARY" ? "Primario" : "Secundario"} — ${filteredSubjects.find((s) => s.id === subjectId)?.name ?? "Selecciona una materia"}`;

	async function onSubmit() {
		setError(null);
		setSubmitting(true);
		const input = {
			grade,
			section,
			educationLevel,
			isHomeroom,
			subjectId: isHomeroom ? undefined : subjectId,
		};

		try {
			if (isEditing) await updateMutation.mutateAsync(input);
			else await createMutation.mutateAsync(input);
			onOpenChange(false);
		} catch (e) {
			setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado");
			setSubmitting(false);
		}
	}

	const submitDisabled = submitting || (!submitting && isDuplicate) || (!isHomeroom && !subjectId);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-120">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Editar Curso" : "Nuevo Curso"}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-2">
					<span className="text-xs font-bold text-[#1a1d21]">Nivel educativo</span>
					<PillSelector
						options={LEVELS}
						value={educationLevel}
						selectedStyle="tinted"
						getLabel={(l) => (l === "PRIMARY" ? "Primario" : "Secundario")}
						onChange={(level) => {
							setEducationLevel(level);
							if (level === "SECONDARY") setIsHomeroom(false);
						}}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<span className="text-xs font-bold text-[#1a1d21]">Grado</span>
					<PillSelector options={GRADES} value={grade} shape="pill" onChange={setGrade} />
				</div>

				<div className="flex flex-col gap-2">
					<span className="text-xs font-bold text-[#1a1d21]">Sección</span>
					<PillSelector options={SECTIONS} value={section} shape="pill" onChange={setSection} />
				</div>

				{educationLevel === "PRIMARY" && (
					<div className="flex flex-col gap-2">
						<span className="text-xs font-bold text-[#1a1d21]">
							¿Eres docente encargado de esta sección?
						</span>
						<HomeroomToggle value={isHomeroom} onChange={setIsHomeroom} />
					</div>
				)}

				{!isHomeroom && (
					<div className="flex flex-col gap-2">
						<span className="text-xs font-bold text-[#1a1d21]">Materia</span>
						<select
							value={subjectId ?? ""}
							onChange={(e) => setSubjectId(e.target.value || undefined)}
							className="rounded-lg border-[1.5px] border-[#d5d8dc] px-3.5 py-2.5 text-sm outline-none focus:border-[#003087]"
						>
							<option value="">Selecciona una materia</option>
							{filteredSubjects.map((s) => (
								<option key={s.id} value={s.id}>
									{s.name}
								</option>
							))}
						</select>
					</div>
				)}

				{!submitting && isDuplicate && (
					<StatusBanner variant="error">
						Ya tienes un curso de {grade} {section} registrado para este año escolar.
					</StatusBanner>
				)}
				{error && <StatusBanner variant="error">{error}</StatusBanner>}

				<div className="rounded-[9px] bg-[#F5F5F5] p-3.5 text-[13px] text-[#1a1d21]">
					📚 {autoInfoText}
				</div>

				<div className="flex gap-2.5">
					<Button
						variant="outline"
						className="flex-1 border-[1.5px] border-[#d5d8dc] text-[#5b5f66]"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						className="flex-1 bg-[#003087] hover:bg-[#002468] disabled:bg-[#a8b5d6]"
						disabled={submitDisabled || createMutation.isPending || updateMutation.isPending}
						onClick={onSubmit}
					>
						{isEditing ? "Guardar Cambios" : "Crear Curso"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
