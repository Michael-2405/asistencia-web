import { useEffect, useState } from "react";
import { PillSelector } from "@/features/courses/components/course-form/PillSelector";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useAddStudent, useUpdateStudent } from "../hooks";
import type { Student } from "../types";

const SEX_OPTIONS = ["M", "F"] as const;

interface StudentFormDialogProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	courseId: string;
	student?: Student;
	onWithdrawRequest?: () => void;
}

export function StudentFormDialog({
	open,
	onOpenChange,
	courseId,
	student,
	onWithdrawRequest,
}: StudentFormDialogProps) {
	const isEditing = Boolean(student);
	const addMutation = useAddStudent(courseId);
	const updateMutation = useUpdateStudent(courseId);

	const [firstName, setFirstName] = useState("");
	const [secondName, setSecondName] = useState("");
	const [firstLastname, setFirstLastname] = useState("");
	const [secondLastname, setSecondLastname] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [sex, setSex] = useState<"M" | "F" | undefined>(undefined);
	const [touched, setTouched] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setFirstName(student?.firstName ?? "");
			setSecondName(student?.secondName ?? "");
			setFirstLastname(student?.firstLastname ?? "");
			setSecondLastname(student?.secondLastname ?? "");
			setBirthDate(student?.birthDate ?? "");
			setSex(student?.sex ?? undefined);
			setTouched(false);
			setSubmitError(null);
		}
	}, [open, student]);

	const firstNameError = touched && !firstName.trim();
	const lastNameError = touched && !firstLastname.trim();
	const fieldClass = (hasError: boolean) =>
		`w-full rounded-lg border-[1.5px] ${hasError ? "border-[#C62828]" : "border-[#d5d8dc]"} px-3.5 py-2.5 text-sm outline-none focus:border-[#003087]`;

	async function onSubmit() {
		setTouched(true);
		if (!firstName.trim() || !firstLastname.trim()) return;

		setSubmitError(null);
		const input = {
			firstName,
			secondName: secondName || undefined,
			firstLastname,
			secondLastname: secondLastname || undefined,
			birthDate: birthDate || undefined,
			sex,
		};

		try {
			if (isEditing && student) await updateMutation.mutateAsync({ studentId: student.id, input });
			else await addMutation.mutateAsync(input);
			onOpenChange(false);
		} catch (e) {
			setSubmitError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-125">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Editar Estudiante" : "Agregar Estudiante"}</DialogTitle>
				</DialogHeader>

				<span className="text-[11.5px] font-extrabold uppercase tracking-wide text-[#8a8f98]">
					Datos personales
				</span>

				<div className="grid grid-cols-2 gap-3.5">
					<label className="flex flex-col gap-1.5">
						<span className="text-[12.5px] font-bold text-[#1a1d21]">Primer nombre *</span>
						<input
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Yohanna"
							className={fieldClass(firstNameError)}
						/>
						{firstNameError && (
							<span className="text-[11.5px] text-[#C62828]">Este campo es obligatorio</span>
						)}
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-[12.5px] font-bold text-[#1a1d21]">Segundo nombre</span>
						<input
							value={secondName}
							onChange={(e) => setSecondName(e.target.value)}
							placeholder="Nicole"
							className={fieldClass(false)}
						/>
					</label>
				</div>

				<div className="grid grid-cols-2 gap-3.5">
					<label className="flex flex-col gap-1.5">
						<span className="text-[12.5px] font-bold text-[#1a1d21]">Primer apellido *</span>
						<input
							value={firstLastname}
							onChange={(e) => setFirstLastname(e.target.value)}
							placeholder="Ramírez"
							className={fieldClass(lastNameError)}
						/>
						{lastNameError && (
							<span className="text-[11.5px] text-[#C62828]">Este campo es obligatorio</span>
						)}
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-[12.5px] font-bold text-[#1a1d21]">Segundo apellido</span>
						<input
							value={secondLastname}
							onChange={(e) => setSecondLastname(e.target.value)}
							placeholder="Peña"
							className={fieldClass(false)}
						/>
					</label>
				</div>

				<div className="grid grid-cols-2 gap-3.5">
					<label className="flex flex-col gap-1.5">
						<span className="text-[12.5px] font-bold text-[#1a1d21]">Fecha de nacimiento</span>
						<input
							type="date"
							value={birthDate}
							onChange={(e) => setBirthDate(e.target.value)}
							className={fieldClass(false)}
						/>
					</label>
					<div className="flex flex-col gap-1.5">
						<span className="text-[12.5px] font-bold text-[#1a1d21]">Sexo</span>
						<PillSelector
							options={SEX_OPTIONS}
							value={sex}
							selectedStyle="tinted"
							getLabel={(s) => (s === "M" ? "Masculino" : "Femenino")}
							onChange={setSex}
						/>
					</div>
				</div>

				{isEditing && student && (
					<div className="rounded-lg bg-[#F5F5F5] px-3.5 py-2.5 text-[12.5px] text-[#5b5f66]">
						Nº de orden: <strong className="text-[#1a1d21]">{student.orderNumber}</strong> (asignado
						automáticamente)
					</div>
				)}

				{submitError && <span className="text-[12.5px] text-[#C62828]">{submitError}</span>}

				<div className="mt-0.5 flex gap-2.5">
					<Button
						variant="outline"
						className="flex-1 border-[1.5px] border-[#d5d8dc] text-[#5b5f66]"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						className="flex-1 bg-[#003087] hover:bg-[#002468]"
						disabled={addMutation.isPending || updateMutation.isPending}
						onClick={onSubmit}
					>
						{isEditing ? "Guardar Cambios" : "Agregar Estudiante"}
					</Button>
				</div>

				{isEditing && onWithdrawRequest && (
					<button
						type="button"
						onClick={onWithdrawRequest}
						className="border-t border-[#F0F0F0] pt-3.5 text-center text-[13px] font-bold text-[#C62828]"
					>
						Registrar Retiro
					</button>
				)}
			</DialogContent>
		</Dialog>
	);
}
