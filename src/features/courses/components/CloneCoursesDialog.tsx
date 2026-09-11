import { useState } from "react";
import { StatusBanner } from "@/features/auth/components/shared/StatusBanner";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useSchoolYears } from "../../academic/hooks";
import { useCloneCourses, useCourses } from "../hooks";

interface CloneCoursesDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	currentSchoolYearId: string;
}

export function CloneCoursesDialog({
	open,
	onOpenChange,
	currentSchoolYearId,
}: CloneCoursesDialogProps) {
	const { data: schoolYears } = useSchoolYears();
	const otherYears = (schoolYears ?? []).filter((y) => y.id !== currentSchoolYearId);
	const [sourceYearId, setSourceYearId] = useState(otherYears[0]?.id ?? "");

	const { data: sourceCourses } = useCourses(sourceYearId);
	const { data: currentCourses } = useCourses(currentSchoolYearId);
	const cloneMutation = useCloneCourses();

	const [checked, setChecked] = useState<Set<string>>(new Set());
	const [result, setResult] = useState<{ createdCount: number; skippedCount: number } | null>(null);

	function exists(course: { grade: string; section: string; subjectId: string | null }) {
		return (currentCourses ?? []).some(
			(c) =>
				c.grade === course.grade &&
				c.section === course.section &&
				c.subjectId === course.subjectId,
		);
	}

	function toggle(id: string) {
		setChecked((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	const selectableCourses = (sourceCourses ?? []).filter((c) => !exists(c));
	const allSelected =
		selectableCourses.length > 0 && selectableCourses.every((c) => checked.has(c.id));

	function toggleAll() {
		if (allSelected) {
			setChecked(new Set());
		} else {
			setChecked(new Set(selectableCourses.map((c) => c.id)));
		}
	}

	async function onConfirm() {
		const res = await cloneMutation.mutateAsync({
			sourceSchoolYearId: sourceYearId,
			courseIds: [...checked],
		});
		setResult({ createdCount: res.createdCount, skippedCount: res.skippedCount });
	}

	function close() {
		setResult(null);
		setChecked(new Set());
		onOpenChange(false);
	}

	if (otherYears.length === 0) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Clonar cursos</DialogTitle>
					</DialogHeader>
					<StatusBanner variant="warning">
						No hay otro año escolar disponible del cual clonar cursos.
					</StatusBanner>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-115">
				{result ? (
					<div className="py-4 text-center">
						<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6ee] text-2xl font-bold text-[#2E7D32]">
							✓
						</div>
						<h3 className="mt-4 text-lg font-bold text-[#1a1a1a]">
							Se crearon {result.createdCount} cursos correctamente
						</h3>
						{result.skippedCount > 0 && (
							<p className="mt-2 text-xs font-medium text-[#6b6b6b]">
								{result.skippedCount} se omitieron por ya existir.
							</p>
						)}
						<Button className="mt-5 w-full bg-[#003087] hover:bg-[#002468]" onClick={close}>
							Ir a Mis Cursos
						</Button>
					</div>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Clonar cursos</DialogTitle>
						</DialogHeader>

						<select
							value={sourceYearId}
							onChange={(e) => {
								setSourceYearId(e.target.value);
								setChecked(new Set());
							}}
							className="rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
						>
							{otherYears.map((y) => (
								<option key={y.id} value={y.id}>
									{y.name}
								</option>
							))}
						</select>

						<p className="text-xs font-medium text-[#6b6b6b]">
							Los estudiantes no se copian — deberás agregarlos manualmente.
						</p>

						<button
							type="button"
							onClick={toggleAll}
							className="self-start text-[12.5px] font-bold text-[#003087]"
						>
							{allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
						</button>

						<div className="flex max-h-70 flex-col overflow-y-auto rounded-[9px] border border-[#E0E0E0]">
							{(sourceCourses ?? []).map((c) => {
								const alreadyExists = exists(c);
								const isChecked = checked.has(c.id);
								return (
									<div
										key={c.id}
										className="flex items-center gap-2.5 border-b border-[#F0F0F0] px-3.5 py-2.5 last:border-b-0"
									>
										<button
											type="button"
											disabled={alreadyExists}
											onClick={() => toggle(c.id)}
											className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded text-[11px] text-white ${
												alreadyExists
													? "border-[1.5px] border-[#E0E0E0] bg-[#F5F5F5]"
													: isChecked
														? "border-[1.5px] border-[#003087] bg-[#003087]"
														: "border-[1.5px] border-[#d5d8dc] bg-white"
											}`}
										>
											{(alreadyExists || isChecked) && "✓"}
										</button>
										<span
											className={`flex-1 text-[13px] font-semibold ${alreadyExists ? "text-[#a8adb5]" : "text-[#1a1a1a]"}`}
										>
											{c.grade} {c.section} {c.subjectName ? `— ${c.subjectName}` : ""}
										</span>
										{alreadyExists && (
											<span className="rounded-md bg-[#F5F5F5] px-2 py-0.5 text-[10.5px] font-bold text-[#8a8f98]">
												Ya existe
											</span>
										)}
									</div>
								);
							})}
						</div>

						<div className="flex gap-2.5">
							<Button
								variant="outline"
								className="flex-1 border-[#E0E0E0] text-[#6b6b6b]"
								onClick={close}
							>
								Cancelar
							</Button>
							<Button
								className="flex-2 bg-[#003087] hover:bg-[#002468] disabled:bg-[#a9b8d9]"
								disabled={checked.size === 0 || cloneMutation.isPending}
								onClick={onConfirm}
							>
								Clonar seleccionados ({checked.size})
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
