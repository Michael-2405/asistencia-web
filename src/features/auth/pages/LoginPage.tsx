import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLogger } from "@/shared/lib/logger";
import { AuthLayout } from "../components/AuthLayout";
import { type LoginCredentials, LoginCredentialsForm } from "../components/LoginCredentialsForm";
import { TwoFactorVerifyForm } from "../components/TwoFactorVerifyForm";
import { authClient } from "../lib/auth-client";

const logger = createLogger("LoginPage");

export function LoginPage() {
	const navigate = useNavigate();
	const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [verifying, setVerifying] = useState(false);

	async function handleCredentialsSubmit(values: LoginCredentials) {
		setError(null);
		const { data, error: signInError } = await authClient.signIn.email(values);

		if (signInError) {
			logger.warn("Login fallido", { email: values.email });
			setError("Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.");
			return;
		}

		if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
			logger.info("Login requiere verificación 2FA");
			setRequiresTwoFactor(true);
			return;
		}

		logger.info("Login exitoso");
		navigate("/courses");
	}

	async function handleTwoFactorSubmit(code: string, useBackupCode: boolean) {
		setError(null);
		setVerifying(true);

		logger.debug("Intentando verificación 2FA", {
			useBackupCode,
			codeLength: code.length,
			clientTime: new Date().toISOString(),
		});

		const result = useBackupCode
			? await authClient.twoFactor.verifyBackupCode({ code })
			: await authClient.twoFactor.verifyTotp({ code });

		setVerifying(false);

		if (result.error) {
			logger.warn("Verificación 2FA fallida", {
				useBackupCode,
				errorStatus: result.error.status,
				errorMessage: result.error.message,
				errorCode: (result.error as { code?: string }).code,
			});
			setError(useBackupCode ? "Código de recuperación inválido" : "Código inválido");
			return;
		}

		logger.info("Verificación 2FA exitosa");
		navigate("/courses");
	}

	return (
		<AuthLayout>
			{requiresTwoFactor ? (
				<TwoFactorVerifyForm onSubmit={handleTwoFactorSubmit} verifying={verifying} error={error} />
			) : (
				<LoginCredentialsForm onSubmit={handleCredentialsSubmit} error={error} />
			)}
		</AuthLayout>
	);
}
