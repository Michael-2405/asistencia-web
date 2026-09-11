import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/http";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useWithdrawStudent } from "../hooks";
import type { Student } from "../types";

const logger = createLogger("WithdrawStudentDialog");

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
			logger.info("Estudiante retirado", { studentId: student.id });
			toast.success("Retiro registrado correctamente");
			onOpenChange(false);
		} catch (e) {
			logger.error("Falló el registro de retiro", e);
			setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-110">
				<DialogHeader>
					<DialogTitle>
						Registrar retiro de {student.firstName} {student.secondName} {student.firstLastname}{" "}
						{student.secondLastname}
					</DialogTitle>
				</DialogHeader>

				<p className="text-[13.5px] leading-relaxed text-[#5b5f66]">
					Al confirmar, el estudiante quedará inactivo con fecha de retiro de hoy, y sus días
					futuros en la asistencia dejarán de solicitarse automáticamente. Esta acción no elimina
					sus datos históricos.
				</p>

				<div className="flex items-start gap-2 rounded-lg border border-[#F7CFA0] bg-[#FFF4E8] px-3.5 py-3 text-[12.5px] text-[#8a4b00]">
					<span>⚠</span>
					<span>
						El número de orden {student.orderNumber} quedará reservado y no será reasignado a otro
						estudiante.
					</span>
				</div>

				{error && <p className="text-[12.5px] font-semibold text-[#C62828]">{error}</p>}

				<div className="mt-0.5 flex gap-2.5">
					<Button
						variant="outline"
						className="flex-1 border-[1.5px] border-[#d5d8dc] text-[#5b5f66]"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						className="flex-1 bg-[#C62828] hover:bg-[#a92020]"
						disabled={withdrawMutation.isPending}
						onClick={onConfirm}
					>
						{withdrawMutation.isPending ? "Confirmando…" : "Confirmar Retiro"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
