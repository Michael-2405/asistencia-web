import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/shared/lib/http";
import { createLogger } from "@/shared/lib/logger";
import { registerTeacher } from "../api";
import { AuthLayout } from "../components/AuthLayout";
import { RegisterConfirmStep } from "../components/RegisterConfirmStep";
import { RegisterProfileStep } from "../components/RegisterProfileStep";
import { RegisterSuccess } from "../components/RegisterSuccess";
import { StatusBanner } from "../components/StatusBanner";
import { StepIndicator } from "../components/StepIndicator";
import {
	type RegisterTeacherFormValues,
	registerTeacherSchema,
} from "../schemas/register-teacher.schema";

const logger = createLogger("RegisterPage");

export function RegisterPage() {
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

	async function goToStep2() {
		const valid = await form.trigger([
			"fullName",
			"email",
			"password",
			"confirmPassword",
			"educationLevel",
			"isHomeroomTeacher",
		]);
		if (valid) {
			setStep(2);
		} else {
			logger.warn("Validación de paso 1 falló", { errors: Object.keys(form.formState.errors) });
		}
	}

	async function onCreateAccount() {
		if (!confirmed) return;
		setSubmitError(null);

		try {
			await registerTeacher(form.getValues());
			logger.info("Registro exitoso");
			setAccountCreated(true);
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Registro falló", { code: error.code });
				setSubmitError(error.message);
				if (error.details) {
					for (const d of error.details)
						form.setError(d.field as keyof RegisterTeacherFormValues, { message: d.message });
				}
			} else {
				logger.error("Error inesperado en registro", error);
				setSubmitError("Ocurrió un error inesperado");
			}
			setStep(1);
		}
	}

	if (accountCreated) {
		return (
			<AuthLayout
				tagline="Crea tu cuenta de docente"
				footerNote="Cuaderno Digital — organiza tu aula en un solo lugar."
			>
				<RegisterSuccess />
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			tagline="Crea tu cuenta de docente"
			footerNote="Cuaderno Digital — organiza tu aula en un solo lugar."
		>
			<StepIndicator steps={["Perfil", "Confirmación"]} currentStep={step} />

			{submitError && (
				<div className="mb-4">
					<StatusBanner variant="error">{submitError}</StatusBanner>
				</div>
			)}

			{step === 1 && <RegisterProfileStep form={form} onContinue={goToStep2} />}

			{step === 2 && (
				<RegisterConfirmStep
					values={form.getValues()}
					confirmed={confirmed}
					onConfirmedChange={setConfirmed}
					onBack={() => setStep(1)}
					onSubmit={onCreateAccount}
					isSubmitting={form.formState.isSubmitting}
				/>
			)}
		</AuthLayout>
	);
}
