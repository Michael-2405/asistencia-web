import { useState } from "react";
import { StatusBanner } from "@/features/auth/components/StatusBanner";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useDeleteCourse } from "../hooks";
import type { Course } from "../types";

interface DeleteCourseDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	course: Course;
}

export function DeleteCourseDialog({ open, onOpenChange, course }: DeleteCourseDialogProps) {
	const deleteMutation = useDeleteCourse();
	const [error, setError] = useState<string | null>(null);

	async function onConfirm() {
		setError(null);
		try {
			await deleteMutation.mutateAsync(course.id);
			onOpenChange(false);
		} catch (e) {
			setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-105">
				<DialogHeader>
					<DialogTitle>
						Eliminar {course.grade} Grado — Sección {course.section}
					</DialogTitle>
				</DialogHeader>

				<p className="text-[13px] font-medium leading-relaxed text-[#6b6b6b]">
					El curso dejará de aparecer en tu lista, pero sus datos históricos (estudiantes,
					asistencia) se conservan.
				</p>

				{course.activeStudentCount > 0 && (
					<div className="rounded-lg border border-[#f6d99a] bg-[#fff8e6] px-3.5 py-3 text-xs font-medium leading-relaxed text-[#a06a00]">
						⚠ Este curso tiene {course.activeStudentCount} estudiante(s) activo(s).
					</div>
				)}

				{error && <StatusBanner variant="error">{error}</StatusBanner>}

				<div className="flex gap-2.5">
					<Button
						variant="outline"
						className="flex-1 border-[#E0E0E0] text-[#6b6b6b]"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						className="flex-2 bg-[#C62828] hover:bg-[#a92020]"
						disabled={deleteMutation.isPending}
						onClick={onConfirm}
					>
						Eliminar curso
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
