import type { RegisterTeacherFormValues } from "../schemas/register-teacher.schema";

interface RegisterConfirmStepProps {
	values: RegisterTeacherFormValues;
	subjectName?: string;
	confirmed: boolean;
	onConfirmedChange: (v: boolean) => void;
	onBack: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
}

export function RegisterConfirmStep({
	values,
	subjectName,
	confirmed,
	onConfirmedChange,
	onBack,
	onSubmit,
	isSubmitting,
}: RegisterConfirmStepProps) {
	const items = [
		{ label: "Nombre completo", value: values.fullName },
		{ label: "Correo electrónico", value: values.email },
		{
			label: "Nivel educativo",
			value: values.educationLevel === "PRIMARY" ? "Nivel Primario" : "Nivel Secundario",
		},
		{
			label: "Tipo de docente",
			value: values.isHomeroomTeacher ? "Encargado de sección" : "Docente de área",
		},
		{
			label: "Materia",
			value: values.isHomeroomTeacher ? "Materias troncales (todas)" : (subjectName ?? "—"),
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-extrabold text-[#1a1d21]">Confirmación</h2>

			<div className="flex flex-col gap-2.5 rounded-[10px] border border-[#E0E0E0] p-4.5">
				{items.map((item) => (
					<div
						key={item.label}
						className="flex justify-between gap-3 border-b border-[#F0F0F0] pb-2 text-[13.5px] last:border-b-0 last:pb-0"
					>
						<span className="text-[#8a8f98]">{item.label}</span>
						<span className="text-right font-semibold text-[#1a1d21]">{item.value}</span>
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={() => onConfirmedChange(!confirmed)}
				className="flex items-start gap-2.5 text-left"
			>
				<div
					className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-[1.5px] text-[11px] text-white ${confirmed ? "border-[#003087] bg-[#003087]" : "border-[#d5d8dc]"}`}
				>
					{confirmed && "✓"}
				</div>
				<span className="text-[13px] text-[#1a1d21]">Confirmo que los datos son correctos</span>
			</button>

			<div className="flex gap-2.5">
				<button
					type="button"
					onClick={onBack}
					className="flex-1 rounded-lg border-[1.5px] border-[#d5d8dc] py-3 text-sm font-semibold text-[#5b5f66]"
				>
					Volver
				</button>
				<button
					type="button"
					disabled={!confirmed || isSubmitting}
					onClick={onSubmit}
					className="flex-1 rounded-lg bg-[#003087] py-3 text-sm font-bold text-white disabled:bg-[#a8b5d6]"
				>
					{isSubmitting ? "Creando…" : "Crear cuenta"}
				</button>
			</div>
		</div>
	);
}
