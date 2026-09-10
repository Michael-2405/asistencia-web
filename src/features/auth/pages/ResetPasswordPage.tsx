import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { createLogger } from "@/shared/lib/logger";
import { ResetPasswordForm } from "../components/reset-password/ResetPasswordForm";
import { AuthLayout } from "../components/shared/AuthLayout";
import { AuthSuccessScreen } from "../components/shared/AuthSuccessScreen";
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
			title="Recupera el acceso a tu cuenta"
			subtitle="Te ayudamos a restablecer tu contraseña de forma segura."
		>
			{done ? (
				<AuthSuccessScreen
					title="Contraseña restablecida"
					description="Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión."
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
