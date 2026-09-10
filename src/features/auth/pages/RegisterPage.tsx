import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchSubjects } from "@/features/courses/api";
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

	const { data: subjects } = useQuery({ queryKey: ["subjects"], queryFn: fetchSubjects });
	const selectedSubjectName = subjects?.find((s) => s.id === form.getValues().subjectId)?.name;

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
				title="Crea tu cuenta de docente"
				subtitle="Regístrate para empezar a gestionar la asistencia y las calificaciones de tus estudiantes."
				wide
			>
				<RegisterSuccess email={form.getValues().email} />
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Crea tu cuenta de docente"
			subtitle="Regístrate para empezar a gestionar la asistencia y las calificaciones de tus estudiantes."
			wide
		>
			<StepIndicator steps={["Perfil", "Confirmación"]} currentStep={step} />

			{submitError && (
				<div className="mt-5 mb-4">
					<StatusBanner variant="error">{submitError}</StatusBanner>
				</div>
			)}

			{step === 1 && <RegisterProfileStep form={form} onContinue={goToStep2} />}

			{step === 2 && (
				<RegisterConfirmStep
					values={form.getValues()}
					subjectName={selectedSubjectName}
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
