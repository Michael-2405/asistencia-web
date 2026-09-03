import { useEffect, useState } from "react";
import { StatusBanner } from "@/features/auth/components/StatusBanner";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import { useAddStudent, useUpdateStudent } from "../hooks";
import type { Student } from "../types";

interface StudentFormSheetProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	courseId: string;
	student?: Student;
	onWithdrawRequest?: () => void;
}

export function StudentFormSheet({
	open,
	onOpenChange,
	courseId,
	student,
	onWithdrawRequest,
}: StudentFormSheetProps) {
	const isEditing = Boolean(student);
	const addMutation = useAddStudent(courseId);
	const updateMutation = useUpdateStudent(courseId);

	const [firstName, setFirstName] = useState("");
	const [secondName, setSecondName] = useState("");
	const [firstLastname, setFirstLastname] = useState("");
	const [secondLastname, setSecondLastname] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [sex, setSex] = useState<"M" | "F" | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setFirstName(student?.firstName ?? "");
			setSecondName(student?.secondName ?? "");
			setFirstLastname(student?.firstLastname ?? "");
			setSecondLastname(student?.secondLastname ?? "");
			setBirthDate(student?.birthDate ?? "");
			setSex(student?.sex ?? undefined);
			setError(null);
		}
	}, [open, student]);

	const requiredOk = firstName.trim().length > 0 && firstLastname.trim().length > 0;

	async function onSubmit() {
		setError(null);
		const input = {
			firstName,
			secondName: secondName || undefined,
			firstLastname,
			secondLastname: secondLastname || undefined,
			birthDate: birthDate || undefined,
			sex,
		};

		try {
			if (isEditing && student) {
				await updateMutation.mutateAsync({ studentId: student.id, input });
			} else {
				await addMutation.mutateAsync(input);
			}
			onOpenChange(false);
		} catch (e) {
			setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado");
		}
	}

	const fieldClass =
		"w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#003087] box-border";

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-115 max-w-[92vw] overflow-y-auto p-7">
				<SheetHeader className="p-0">
					<SheetTitle className="text-xl font-bold text-[#1a1a1a]">
						{isEditing ? "Editar Estudiante" : "Agregar Estudiante"}
					</SheetTitle>
				</SheetHeader>

				{isEditing && student && (
					<div className="mt-4.5 rounded-md bg-[#F5F5F5] px-3 py-2.5 text-xs font-medium text-[#6b6b6b]">
						Nº de orden: {student.orderNumber} (asignado automáticamente)
					</div>
				)}

				<div className="mt-5.5 text-[13px] font-bold text-[#333]">Datos personales</div>

				<div className="mt-3.5 grid grid-cols-2 gap-3">
					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Primer nombre *</span>
						<input
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							className={fieldClass}
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Segundo nombre</span>
						<input
							value={secondName}
							onChange={(e) => setSecondName(e.target.value)}
							className={fieldClass}
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Primer apellido *</span>
						<input
							value={firstLastname}
							onChange={(e) => setFirstLastname(e.target.value)}
							className={fieldClass}
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Segundo apellido</span>
						<input
							value={secondLastname}
							onChange={(e) => setSecondLastname(e.target.value)}
							className={fieldClass}
						/>
					</label>
				</div>

				<div className="mt-3.5 grid grid-cols-2 gap-3">
					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Fecha de nacimiento</span>
						<input
							type="date"
							value={birthDate}
							onChange={(e) => setBirthDate(e.target.value)}
							className={fieldClass}
						/>
					</label>
					<div>
						<span className="text-xs font-semibold text-[#333]">Sexo</span>
						<div className="mt-1.5 flex gap-2">
							{(["M", "F"] as const).map((opt) => (
								<button
									key={opt}
									type="button"
									onClick={() => setSex(opt)}
									className={`flex-1 rounded-lg border-[1.5px] py-2 text-xs font-bold ${
										sex === opt
											? "border-[#003087] bg-[#eef3fb] text-[#003087]"
											: "border-[#E0E0E0] text-[#333]"
									}`}
								>
									{opt === "M" ? "Masculino" : "Femenino"}
								</button>
							))}
						</div>
					</div>
				</div>

				{error && (
					<div className="mt-4">
						<StatusBanner variant="error">{error}</StatusBanner>
					</div>
				)}

				<div className="mt-6.5 flex gap-2.5">
					<Button
						variant="outline"
						className="flex-1 border-[#E0E0E0] text-[#6b6b6b]"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						className="flex-2 bg-[#003087] hover:bg-[#002468] disabled:bg-[#a9b8d9]"
						disabled={!requiredOk || addMutation.isPending || updateMutation.isPending}
						onClick={onSubmit}
					>
						{isEditing ? "Guardar Cambios" : "Agregar Estudiante"}
					</Button>
				</div>

				{isEditing && onWithdrawRequest && (
					<div className="mt-5.5 border-t border-[#F0F0F0] pt-4">
						<button
							type="button"
							onClick={onWithdrawRequest}
							className="w-full rounded-lg border border-[#f2b3b3] bg-[#fdeeee] py-2.5 text-xs font-bold text-[#C62828]"
						>
							Registrar Retiro
						</button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
