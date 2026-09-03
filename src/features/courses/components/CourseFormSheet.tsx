import { useEffect, useState } from "react";
import { StatusBanner } from "@/features/auth/components/StatusBanner";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import { useCourses, useCreateCourse, useSubjects, useUpdateCourse } from "../hooks";
import type { Course } from "../types";

const GRADES = ["1ro", "2do", "3ro", "4to", "5to", "6to"];

interface CourseFormSheetProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	schoolYearId: string;
	course?: Course;
}

export function CourseFormSheet({
	open,
	onOpenChange,
	schoolYearId,
	course,
}: CourseFormSheetProps) {
	const isEditing = Boolean(course);
	const { data: subjects } = useSubjects();
	const { data: existingCourses } = useCourses(schoolYearId);
	const createMutation = useCreateCourse();
	const updateMutation = useUpdateCourse(course?.id ?? "");

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
		: `Nivel ${educationLevel === "PRIMARY" ? "Primario" : "Secundario"} — ${
				filteredSubjects.find((s) => s.id === subjectId)?.name ?? "Selecciona una materia"
			}`;

	async function onSubmit() {
		setError(null);
		const input = {
			grade,
			section,
			educationLevel,
			isHomeroom,
			subjectId: isHomeroom ? undefined : subjectId,
		};

		try {
			if (isEditing) {
				await updateMutation.mutateAsync(input);
			} else {
				await createMutation.mutateAsync(input);
			}
			onOpenChange(false);
		} catch (e) {
			setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado");
		}
	}

	const submitDisabled = isDuplicate || (!isHomeroom && !subjectId);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-115 max-w-[92vw] overflow-y-auto p-7">
				<SheetHeader className="p-0">
					<SheetTitle className="text-xl font-bold text-[#1a1a1a]">
						{isEditing ? "Editar Curso" : "Nuevo Curso"}
					</SheetTitle>
				</SheetHeader>

				<div className="mt-6">
					<span className="text-xs font-semibold text-[#333]">Nivel educativo</span>
					<div className="mt-2 flex gap-2">
						{(["PRIMARY", "SECONDARY"] as const).map((level) => (
							<button
								key={level}
								type="button"
								onClick={() => {
									setEducationLevel(level);
									if (level === "SECONDARY") setIsHomeroom(false);
								}}
								className={`flex-1 rounded-lg border-[1.5px] py-2.5 text-xs font-bold ${
									educationLevel === level
										? "border-[#003087] bg-[#eef3fb] text-[#003087]"
										: "border-[#E0E0E0] text-[#333]"
								}`}
							>
								{level === "PRIMARY" ? "Primario" : "Secundario"}
							</button>
						))}
					</div>
				</div>

				<div className="mt-5">
					<span className="text-xs font-semibold text-[#333]">Grado</span>
					<div className="mt-2 flex flex-wrap gap-2">
						{GRADES.map((g) => (
							<button
								key={g}
								type="button"
								onClick={() => setGrade(g)}
								className={`rounded-full border-[1.5px] px-4 py-2 text-xs font-bold ${
									grade === g
										? "border-[#003087] bg-[#003087] text-white"
										: "border-[#E0E0E0] text-[#333]"
								}`}
							>
								{g}
							</button>
						))}
					</div>
				</div>

				<div className="mt-5">
					<span className="text-xs font-semibold text-[#333]">Sección</span>
					<div className="mt-2 flex flex-wrap gap-2">
						{["A", "B", "C", "D", "E"].map((sec) => (
							<button
								key={sec}
								type="button"
								onClick={() => setSection(sec)}
								className={`flex h-9.5 w-9.5 items-center justify-center rounded-full border-[1.5px] text-[13px] font-bold ${
									section === sec
										? "border-[#003087] bg-[#003087] text-white"
										: "border-[#E0E0E0] text-[#333]"
								}`}
							>
								{sec}
							</button>
						))}
					</div>
				</div>

				{educationLevel === "PRIMARY" && (
					<div className="mt-5">
						<span className="text-xs font-semibold text-[#333]">
							¿Eres docente encargado de esta sección?
						</span>
						<div className="mt-2 flex flex-col gap-2">
							{[
								{
									value: true,
									title: "Sí — Docente encargado",
									desc: "Imparto las materias troncales",
								},
								{
									value: false,
									title: "No — Docente de área",
									desc: "Imparto una materia específica",
								},
							].map((opt) => (
								<button
									key={String(opt.value)}
									type="button"
									onClick={() => setIsHomeroom(opt.value)}
									className={`rounded-lg border-[1.5px] p-3 text-left ${
										isHomeroom === opt.value ? "border-[#003087] bg-[#eef3fb]" : "border-[#E0E0E0]"
									}`}
								>
									<div className="text-[13px] font-bold text-[#1a1a1a]">{opt.title}</div>
									<div className="mt-0.5 text-[11px] font-medium text-[#6b6b6b]">{opt.desc}</div>
								</button>
							))}
						</div>
					</div>
				)}

				{!isHomeroom && (
					<div className="mt-5">
						<span className="text-xs font-semibold text-[#333]">Materia</span>
						<select
							value={subjectId ?? ""}
							onChange={(e) => setSubjectId(e.target.value || undefined)}
							className="mt-2 w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
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

				<div className="mt-5 flex gap-2.5 rounded-lg bg-[#eef3fb] p-3.5">
					<span className="text-base">📚</span>
					<span className="text-xs font-medium text-[#1a1a1a]">{autoInfoText}</span>
				</div>

				{isDuplicate && (
					<div className="mt-4">
						<StatusBanner variant="error">
							Ya tienes un curso de {grade} {section} registrado para este año escolar.
						</StatusBanner>
					</div>
				)}

				{error && (
					<div className="mt-4">
						<StatusBanner variant="error">{error}</StatusBanner>
					</div>
				)}

				<div className="mt-7 flex gap-2.5">
					<Button
						variant="outline"
						className="flex-1 border-[#E0E0E0] text-[#6b6b6b]"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						className="flex-2 bg-[#003087] hover:bg-[#002468] disabled:bg-[#a9b8d9]"
						disabled={submitDisabled || createMutation.isPending || updateMutation.isPending}
						onClick={onSubmit}
					>
						{isEditing ? "Guardar Cambios" : "Crear Curso"}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
