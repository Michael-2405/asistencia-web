import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { createLogger } from "@/shared/lib/logger";
import { AuthLayout } from "../components/AuthLayout";
import { AuthSuccessScreen } from "../components/AuthSuccessScreen";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { authClient } from "../lib/auth-client";

const logger = createLogger("ResetPasswordPage");

export function ResetPasswordPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get("token");

	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [done, setDone] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	async function onReset() {
		setError(null);

		if (!token) {
			logger.warn("Intento de restablecer contraseña sin token en la URL");
			setError("Enlace inválido o expirado");
			return;
		}
		if (newPassword !== confirmNewPassword) {
			setError("Las contraseñas no coinciden");
			return;
		}

		setSubmitting(true);
		const { error: resetError } = await authClient.resetPassword({ newPassword, token });
		setSubmitting(false);

		if (resetError) {
			logger.warn("Falló el restablecimiento de contraseña");
			setError("No se pudo restablecer la contraseña. El enlace pudo haber expirado.");
			return;
		}

		logger.info("Contraseña restablecida exitosamente");
		toast.success("Contraseña actualizada");
		setDone(true);
	}

	return (
		<AuthLayout
			tagline="Crea una nueva contraseña"
			footerNote="Cuaderno Digital — organiza tu aula en un solo lugar."
		>
			{done ? (
				<AuthSuccessScreen
					title="Contraseña actualizada"
					description="Ya puedes iniciar sesión con tu nueva contraseña."
					buttonLabel="Ir al inicio de sesión"
					onButtonClick={() => navigate("/login")}
				/>
			) : (
				<ResetPasswordForm
					newPassword={newPassword}
					confirmNewPassword={confirmNewPassword}
					onNewPasswordChange={setNewPassword}
					onConfirmNewPasswordChange={setConfirmNewPassword}
					onSubmit={onReset}
					error={error}
					submitting={submitting}
				/>
			)}
		</AuthLayout>
	);
}
