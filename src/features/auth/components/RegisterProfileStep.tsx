import type { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { FIELD_CLASS } from "../constants";
import type { RegisterTeacherFormValues } from "../schemas/register-teacher.schema";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { StatusBanner } from "./StatusBanner";

interface RegisterProfileStepProps {
	form: UseFormReturn<RegisterTeacherFormValues>;
	onContinue: () => void;
}

export function RegisterProfileStep({ form, onContinue }: RegisterProfileStepProps) {
	const values = form.watch();

	return (
		<div className="space-y-4">
			<h2 className="text-[22px] font-bold text-[#1a1a1a]">Información del perfil docente</h2>

			<label className="flex flex-col gap-1.5">
				<span className="text-xs font-semibold text-[#333]">Nombre completo</span>
				<input {...form.register("fullName")} className={FIELD_CLASS} />
				{form.formState.errors.fullName && (
					<span className="text-xs text-[#C62828]">{form.formState.errors.fullName.message}</span>
				)}
			</label>

			<label className="flex flex-col gap-1.5">
				<span className="text-xs font-semibold text-[#333]">Correo electrónico</span>
				<input
					type="email"
					{...form.register("email")}
					placeholder="nombre.apellido@correo.com"
					className={FIELD_CLASS}
				/>
				{form.formState.errors.email && (
					<span className="text-xs text-[#C62828]">{form.formState.errors.email.message}</span>
				)}
			</label>

			<label htmlFor="register-password" className="flex flex-col gap-1.5">
				<span className="text-xs font-semibold text-[#333]">Contraseña</span>
				<PasswordInput id="register-password" {...form.register("password")} />
				<PasswordStrengthMeter password={values.password ?? ""} />
				{form.formState.errors.password && (
					<span className="text-xs text-[#C62828]">{form.formState.errors.password.message}</span>
				)}
			</label>

			<label htmlFor="register-confirm-password" className="flex flex-col gap-1.5">
				<span className="text-xs font-semibold text-[#333]">Confirmar contraseña</span>
				<PasswordInput id="register-confirm-password" {...form.register("confirmPassword")} />
				{form.formState.errors.confirmPassword && (
					<span className="text-xs text-[#C62828]">
						{form.formState.errors.confirmPassword.message}
					</span>
				)}
			</label>

			<div>
				<span className="text-xs font-semibold text-[#333]">
					Nivel educativo en el que imparte clases
				</span>
				<div className="mt-2 flex gap-2.5">
					{(["PRIMARY", "SECONDARY"] as const).map((level) => (
						<button
							type="button"
							key={level}
							onClick={() => {
								form.setValue("educationLevel", level);
								if (level === "SECONDARY") form.setValue("isHomeroomTeacher", false);
							}}
							className={`flex-1 rounded-lg border-[1.5px] py-2.5 text-xs font-bold ${
								values.educationLevel === level
									? "border-[#003087] bg-[#eef3fb] text-[#003087]"
									: "border-[#E0E0E0] text-[#333]"
							}`}
						>
							{level === "PRIMARY" ? "Nivel Primario" : "Nivel Secundario"}
						</button>
					))}
				</div>
			</div>

			{values.educationLevel === "PRIMARY" && (
				<div>
					<span className="text-xs font-semibold text-[#333]">
						¿Eres docente encargado de una sección?
					</span>
					<div className="mt-2 flex flex-col gap-2">
						{[
							{
								value: true,
								title: "Sí — Soy docente encargado",
								desc: "Imparto las materias troncales de mi sección",
							},
							{
								value: false,
								title: "No — Soy docente de área",
								desc: "Imparto una materia específica",
							},
						].map((opt) => (
							<button
								type="button"
								key={String(opt.value)}
								onClick={() => form.setValue("isHomeroomTeacher", opt.value)}
								className={`rounded-lg border-[1.5px] p-3 text-left ${
									values.isHomeroomTeacher === opt.value
										? "border-[#003087] bg-[#eef3fb]"
										: "border-[#E0E0E0]"
								}`}
							>
								<div className="text-[13px] font-bold text-[#1a1a1a]">{opt.title}</div>
								<div className="mt-0.5 text-[11px] font-medium text-[#6b6b6b]">{opt.desc}</div>
							</button>
						))}
					</div>
				</div>
			)}

			{!values.isHomeroomTeacher && (
				<StatusBanner variant="warning">
					Selección de materia próximamente — el catálogo de materias aún no está disponible.
				</StatusBanner>
			)}

			<Button type="button" className="w-full bg-[#003087] hover:bg-[#002468]" onClick={onContinue}>
				Continuar
			</Button>

			<p className="text-center text-xs font-medium text-[#8a8a8a]">
				¿Ya tienes cuenta?{" "}
				<Link to="/login" className="font-semibold text-[#003087]">
					Inicia sesión
				</Link>
			</p>
		</div>
	);
}
