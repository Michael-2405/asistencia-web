import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { registerTeacher } from "../api";
import { AuthLayout } from "../components/AuthLayout";
import { StatusBanner } from "../components/StatusBanner";
import { StepIndicator } from "../components/StepIndicator";
import {
	type RegisterTeacherFormValues,
	registerTeacherSchema,
} from "../schemas/register-teacher.schema";

const FIELD_CLASS =
	"rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#003087] w-full box-border";

export function RegisterPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [confirmed, setConfirmed] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [accountCreated, setAccountCreated] = useState(false);

	const form = useForm<RegisterTeacherFormValues>({
		resolver: zodResolver(registerTeacherSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
			educationLevel: "PRIMARY",
			isHomeroomTeacher: true,
			subjectId: undefined,
		},
	});

	const values = form.watch();
	const pwLen = values.password?.length ?? 0;
	let strength = 0;
	if (pwLen >= 8) strength++;
	if (/[A-Z]/.test(values.password ?? "")) strength++;
	if (/[0-9]/.test(values.password ?? "") && /[a-z]/.test(values.password ?? "")) strength++;
	const strengthLabel =
		pwLen === 0 ? "" : strength <= 1 ? "Débil" : strength === 2 ? "Media" : "Fuerte";
	const strengthColor = strength <= 1 ? "#C62828" : strength === 2 ? "#E65100" : "#2E7D32";

	async function goToStep2() {
		const valid = await form.trigger([
			"fullName",
			"email",
			"password",
			"confirmPassword",
			"educationLevel",
			"isHomeroomTeacher",
		]);
		if (valid) setStep(2);
	}

	async function onCreateAccount() {
		if (!confirmed) return;
		setSubmitError(null);

		try {
			await registerTeacher(form.getValues());
			setAccountCreated(true);
		} catch (error) {
			if (error instanceof ApiError) {
				setSubmitError(error.message);
				if (error.details) {
					for (const d of error.details)
						form.setError(d.field as keyof RegisterTeacherFormValues, { message: d.message });
				}
			} else {
				setSubmitError("Ocurrió un error inesperado");
			}
			setStep(1);
		}
	}

	if (accountCreated) {
		return (
			<AuthLayout
				tagline="Crea tu cuenta de docente"
				footerNote="Herramienta oficial del MINERD para el registro de asistencia."
			>
				<div className="py-6 text-center">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6ee] text-2xl font-bold text-[#2E7D32]">
						✓
					</div>
					<h2 className="mt-4 text-xl font-bold text-[#1a1a1a]">Cuenta creada</h2>
					<p className="mt-2 text-sm font-medium text-[#6b6b6b]">
						Revisa tu correo para confirmar tu email antes de iniciar sesión.
					</p>
					<Button
						className="mt-6 w-full bg-[#003087] hover:bg-[#002468]"
						onClick={() => navigate("/login")}
					>
						Ir al inicio de sesión
					</Button>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			tagline="Crea tu cuenta de docente"
			footerNote="Herramienta oficial del MINERD para el registro de asistencia."
		>
			<StepIndicator steps={["Perfil", "Confirmación"]} currentStep={step} />

			{submitError && (
				<div className="mb-4">
					<StatusBanner variant="error">{submitError}</StatusBanner>
				</div>
			)}

			{step === 1 && (
				<div className="space-y-4">
					<div>
						<h2 className="text-[22px] font-bold text-[#1a1a1a]">Información del perfil docente</h2>
					</div>

					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Nombre completo</span>
						<input {...form.register("fullName")} className={FIELD_CLASS} />
						{form.formState.errors.fullName && (
							<span className="text-xs text-[#C62828]">
								{form.formState.errors.fullName.message}
							</span>
						)}
					</label>

					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">
							Correo electrónico institucional
						</span>
						<input
							type="email"
							{...form.register("email")}
							placeholder="nombre.apellido@minerd.edu.do"
							className={FIELD_CLASS}
						/>
						{form.formState.errors.email && (
							<span className="text-xs text-[#C62828]">{form.formState.errors.email.message}</span>
						)}
					</label>

					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Contraseña</span>
						<input type="password" {...form.register("password")} className={FIELD_CLASS} />
						{pwLen > 0 && (
							<div className="mt-0.5 flex gap-1">
								{[0, 1, 2].map((i) => (
									<div
										key={i}
										className="h-1 flex-1 rounded-full"
										style={{ background: i < strength ? strengthColor : "#E0E0E0" }}
									/>
								))}
							</div>
						)}
						{strengthLabel && (
							<span className="text-[11px] font-semibold" style={{ color: strengthColor }}>
								{strengthLabel}
							</span>
						)}
						{form.formState.errors.password && (
							<span className="text-xs text-[#C62828]">
								{form.formState.errors.password.message}
							</span>
						)}
					</label>

					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Confirmar contraseña</span>
						<input type="password" {...form.register("confirmPassword")} className={FIELD_CLASS} />
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

					<Button
						type="button"
						className="w-full bg-[#003087] hover:bg-[#002468]"
						onClick={goToStep2}
					>
						Continuar
					</Button>

					<p className="text-center text-xs font-medium text-[#8a8a8a]">
						¿Ya tienes cuenta?{" "}
						<Link to="/login" className="font-semibold text-[#003087]">
							Inicia sesión
						</Link>
					</p>
				</div>
			)}

			{step === 2 && (
				<div>
					<h2 className="text-[22px] font-bold text-[#1a1a1a]">Confirma tus datos</h2>
					<div className="mt-5 flex flex-col gap-2.5 rounded-lg border border-[#E0E0E0] p-4 text-[13px]">
						<Row label="Nombre" value={values.fullName} />
						<Row label="Correo" value={values.email} />
						<Row
							label="Nivel"
							value={values.educationLevel === "PRIMARY" ? "Primario" : "Secundario"}
						/>
						<Row
							label="Rol"
							value={values.isHomeroomTeacher ? "Encargado de sección" : "Docente de área"}
						/>
					</div>

					<label htmlFor="confirm-data" className="mt-5 flex items-center gap-2">
						<Checkbox
							id="confirm-data"
							checked={confirmed}
							onCheckedChange={(c) => setConfirmed(c === true)}
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
							onClick={() => setStep(1)}
						>
							Atrás
						</Button>
						<Button
							type="button"
							disabled={!confirmed || form.formState.isSubmitting}
							className="flex-2 bg-[#003087] hover:bg-[#002468] disabled:bg-[#a9b8d9]"
							onClick={onCreateAccount}
						>
							{form.formState.isSubmitting ? "Creando…" : "Crear cuenta"}
						</Button>
					</div>
				</div>
			)}
		</AuthLayout>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between border-t border-[#F0F0F0] pt-2.5 first:border-t-0 first:pt-0">
			<span className="text-[#6b6b6b]">{label}</span>
			<span className="font-semibold text-[#1a1a1a]">{value}</span>
		</div>
	);
}
