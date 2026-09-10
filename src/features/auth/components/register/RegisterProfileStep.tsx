import { useQuery } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { fetchSubjects } from "@/features/courses/api";
import { FIELD_CLASS } from "../../constants";
import type { RegisterTeacherFormValues } from "../../schemas/register-teacher.schema";
import { PasswordInput } from "../shared/PasswordInput";
import { PasswordStrengthMeter } from "../shared/PasswordStrengthMeter";

interface RegisterProfileStepProps {
	form: UseFormReturn<RegisterTeacherFormValues>;
	onContinue: () => void;
}

export function RegisterProfileStep({ form, onContinue }: RegisterProfileStepProps) {
	const values = form.watch();
	const { data: subjects } = useQuery({ queryKey: ["subjects"], queryFn: fetchSubjects });

	const showPrimarioQuestion = values.educationLevel === "PRIMARY";
	const showMateriaSelect =
		values.educationLevel === "SECONDARY" ||
		(values.educationLevel === "PRIMARY" && values.isHomeroomTeacher === false);
	const filteredSubjects = (subjects ?? []).filter(
		(s) => s.level === values.educationLevel || s.level === "BOTH",
	);

	const passwordsMismatch =
		Boolean(values.confirmPassword) && values.confirmPassword !== values.password;

	const canContinue =
		values.fullName &&
		values.email &&
		values.password &&
		values.confirmPassword === values.password &&
		values.educationLevel &&
		(values.educationLevel === "SECONDARY" ||
			values.isHomeroomTeacher === true ||
			values.isHomeroomTeacher === false);

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-extrabold text-[#1a1d21]">Información del perfil docente</h2>

			<label className="flex flex-col gap-1.5">
				<span className="text-xs font-bold text-[#1a1d21]">Nombre completo</span>
				<input
					{...form.register("fullName")}
					placeholder="Carmen Julia Ventura"
					className={FIELD_CLASS}
				/>
				{form.formState.errors.fullName && (
					<span className="text-[11.5px] text-[#C62828]">
						{form.formState.errors.fullName.message}
					</span>
				)}
			</label>

			<label className="flex flex-col gap-1.5">
				<span className="text-xs font-bold text-[#1a1d21]">Correo electrónico</span>
				<input
					type="email"
					{...form.register("email")}
					placeholder="nombre@escuela.edu.do"
					className={FIELD_CLASS}
				/>
				{form.formState.errors.email && (
					<span className="text-[11.5px] text-[#C62828]">
						{form.formState.errors.email.message}
					</span>
				)}
			</label>

			<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
				<label htmlFor="register-password" className="flex flex-col gap-1.5">
					<span className="text-xs font-bold text-[#1a1d21]">Contraseña</span>
					<PasswordInput id="register-password" {...form.register("password")} />
					<PasswordStrengthMeter password={values.password ?? ""} />
				</label>
				<label htmlFor="register-confirm-password" className="flex flex-col gap-1.5">
					<span className="text-xs font-bold text-[#1a1d21]">Confirmar contraseña</span>
					<PasswordInput
						id="register-confirm-password"
						{...form.register("confirmPassword")}
						borderClassName={passwordsMismatch ? "border-[#C62828]" : "border-[#d5d8dc]"}
					/>
					{passwordsMismatch && (
						<span className="text-[11.5px] text-[#C62828]">Las contraseñas no coinciden</span>
					)}
				</label>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-xs font-bold text-[#1a1d21]">
					Nivel educativo en el que imparte clases
				</span>
				<div className="flex gap-2.5">
					{(["PRIMARY", "SECONDARY"] as const).map((level) => (
						<button
							key={level}
							type="button"
							onClick={() => {
								form.setValue("educationLevel", level);
								form.setValue(
									"isHomeroomTeacher",
									level === "SECONDARY" ? false : (undefined as unknown as boolean),
								);
								form.setValue("subjectId", undefined);
							}}
							className={`flex-1 rounded-lg border-[1.5px] py-2.5 text-[13.5px] font-bold ${values.educationLevel === level ? "border-[#003087] bg-[#EEF2FB] text-[#003087]" : "border-[#d5d8dc] text-[#5b5f66]"}`}
						>
							{level === "PRIMARY" ? "Nivel Primario" : "Nivel Secundario"}
						</button>
					))}
				</div>
			</div>

			{showPrimarioQuestion && (
				<div className="flex flex-col gap-2.5 rounded-[9px] bg-[#F5F5F5] p-3.5">
					<span className="text-xs font-bold text-[#1a1d21]">
						¿Eres docente encargado de una sección?
					</span>
					{[
						{
							value: true,
							title: "Sí — Soy docente encargado",
							desc: "Imparto las materias troncales de mi sección (Lengua Española, Matemáticas, Ciencias Sociales, Ciencias Naturales).",
						},
						{
							value: false,
							title: "No — Soy docente de área",
							desc: "Imparto una materia específica.",
						},
					].map((opt) => (
						<button
							type="button"
							key={String(opt.value)}
							onClick={() => {
								form.setValue("isHomeroomTeacher", opt.value);
								form.setValue("subjectId", undefined);
							}}
							className={`flex items-start gap-2.5 rounded-lg border-[1.5px] p-2.5 text-left ${values.isHomeroomTeacher === opt.value ? "border-[#003087] bg-white" : "border-transparent"}`}
						>
							<div
								className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${values.isHomeroomTeacher === opt.value ? "border-[#003087] bg-[#003087]" : "border-[#c4c7cc]"}`}
							/>
							<div>
								<div className="text-[13.5px] font-bold text-[#1a1d21]">{opt.title}</div>
								<div className="mt-0.5 text-xs text-[#5b5f66]">{opt.desc}</div>
							</div>
						</button>
					))}
				</div>
			)}

			{showMateriaSelect && (
				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-bold text-[#1a1d21]">¿Qué materia impartes?</span>
					<select
						value={values.subjectId ?? ""}
						onChange={(e) => form.setValue("subjectId", e.target.value || undefined)}
						className={FIELD_CLASS}
					>
						<option value="">Selecciona una materia</option>
						{filteredSubjects.map((s) => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))}
					</select>
				</label>
			)}

			<button
				type="button"
				disabled={!canContinue}
				onClick={onContinue}
				className="mt-1.5 rounded-lg bg-[#003087] py-3 text-[14.5px] font-bold text-white disabled:bg-[#a8b5d6]"
			>
				Continuar
			</button>
		</div>
	);
}
