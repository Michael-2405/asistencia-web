import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import type { RegisterTeacherFormValues } from "../schemas/register-teacher.schema";
import { SummaryRow } from "./SummaryRow";

interface RegisterConfirmStepProps {
	values: RegisterTeacherFormValues;
	confirmed: boolean;
	onConfirmedChange: (v: boolean) => void;
	onBack: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
}

export function RegisterConfirmStep({
	values,
	confirmed,
	onConfirmedChange,
	onBack,
	onSubmit,
	isSubmitting,
}: RegisterConfirmStepProps) {
	return (
		<div>
			<h2 className="text-[22px] font-bold text-[#1a1a1a]">Confirma tus datos</h2>
			<div className="mt-5 flex flex-col gap-2.5 rounded-lg border border-[#E0E0E0] p-4 text-[13px]">
				<SummaryRow label="Nombre" value={values.fullName} />
				<SummaryRow label="Correo" value={values.email} />
				<SummaryRow
					label="Nivel"
					value={values.educationLevel === "PRIMARY" ? "Primario" : "Secundario"}
				/>
				<SummaryRow
					label="Rol"
					value={values.isHomeroomTeacher ? "Encargado de sección" : "Docente de área"}
				/>
			</div>

			<label htmlFor="confirm-data" className="mt-5 flex items-center gap-2">
				<Checkbox
					id="confirm-data"
					checked={confirmed}
					onCheckedChange={(c) => onConfirmedChange(c === true)}
				/>
				<span className="text-xs font-medium text-[#333]">
					Confirmo que los datos son correctos.
				</span>
			</label>

			<div className="mt-5 flex gap-2.5">
				<Button
					type="button"
					variant="outline"
					className="flex-1 border-[#E0E0E0] text-[#6b6b6b]"
					onClick={onBack}
				>
					Atrás
				</Button>
				<Button
					type="button"
					disabled={!confirmed || isSubmitting}
					className="flex-2 bg-[#003087] hover:bg-[#002468] disabled:bg-[#a9b8d9]"
					onClick={onSubmit}
				>
					{isSubmitting ? "Creando…" : "Crear cuenta"}
				</Button>
			</div>
		</div>
	);
}
