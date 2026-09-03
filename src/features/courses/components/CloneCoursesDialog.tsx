import { useState } from "react";
import { StatusBanner } from "@/features/auth/components/StatusBanner";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useCloneCourses, useCourses, useSchoolYears } from "../hooks";

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

						<div className="flex max-h-70 flex-col gap-2 overflow-y-auto">
							{(sourceCourses ?? []).map((c) => {
								const alreadyExists = exists(c);
								return (
									<label
										key={c.id}
										className={`flex items-center gap-3 rounded-lg border border-[#E0E0E0] p-3 ${
											alreadyExists ? "cursor-not-allowed opacity-60" : "cursor-pointer"
										}`}
									>
										<input
											type="checkbox"
											checked={checked.has(c.id)}
											disabled={alreadyExists}
											onChange={() => toggle(c.id)}
										/>
										<span className="flex-1 text-[13px] font-semibold text-[#1a1a1a]">
											{c.grade} {c.section} {c.subjectName ? `— ${c.subjectName}` : ""}
										</span>
										{alreadyExists && (
											<span className="rounded-md bg-[#F0F0F0] px-2 py-0.5 text-[10px] font-bold text-[#6b6b6b]">
												Ya existe
											</span>
										)}
									</label>
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
