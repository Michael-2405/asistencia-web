import { useState } from "react";
import { StatusBanner } from "@/features/auth/components/StatusBanner";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useWithdrawStudent } from "../hooks";
import type { Student } from "../types";

interface WithdrawStudentDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	courseId: string;
	student: Student;
}

export function WithdrawStudentDialog({
	open,
	onOpenChange,
	courseId,
	student,
}: WithdrawStudentDialogProps) {
	const withdrawMutation = useWithdrawStudent(courseId);
	const [error, setError] = useState<string | null>(null);

	async function onConfirm() {
		setError(null);
		try {
			await withdrawMutation.mutateAsync(student.id);
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
						Registrar retiro de {student.firstName} {student.firstLastname}
					</DialogTitle>
				</DialogHeader>

				<p className="text-[13px] font-medium leading-relaxed text-[#6b6b6b]">
					Al registrar el retiro, el estudiante quedará inactivo y sus días futuros en la asistencia
					se marcarán automáticamente. Esta acción no elimina sus datos históricos.
				</p>

				<div className="rounded-lg border border-[#f6d99a] bg-[#fff8e6] px-3.5 py-3 text-xs font-medium leading-relaxed text-[#a06a00]">
					⚠ El número de orden {student.orderNumber} quedará reservado y no será reasignado a otro
					estudiante.
				</div>

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
						disabled={withdrawMutation.isPending}
						onClick={onConfirm}
					>
						Confirmar Retiro
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
