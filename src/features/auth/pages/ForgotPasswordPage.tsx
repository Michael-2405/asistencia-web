import { useState } from "react";
import { toast } from "sonner";
import { useCountdown } from "@/shared/hooks/useCountdown";
import { createLogger } from "@/shared/lib/logger";
import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordRequestView } from "../components/ForgotPasswordRequestView";
import { ForgotPasswordSentView } from "../components/ForgotPasswordSentView";
import { authClient } from "../lib/auth-client";

const RESEND_COOLDOWN_SECONDS = 60;
const logger = createLogger("ForgotPasswordPage");

export function ForgotPasswordPage() {
	const [view, setView] = useState<"request" | "sent">("request");
	const [email, setEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const countdown = useCountdown(RESEND_COOLDOWN_SECONDS);

	async function send() {
		setSubmitting(true);
		const { error: requestError } = await authClient.requestPasswordReset({
			email,
			redirectTo: `${window.location.origin}/reset-password`,
		});
		setSubmitting(false);

		if (requestError) {
			logger.error("Falló el envío de recuperación de contraseña", requestError);
			toast.error("No se pudo enviar el enlace. Verifica tu conexión e intenta de nuevo.");
			return;
		}

		logger.info("Solicitud de recuperación enviada");
		toast.success("Enlace de recuperación enviado");
		setView("sent");
		countdown.start();
	}

	return (
		<AuthLayout
			tagline="Recupera el acceso a tu cuenta"
			footerNote="Cuaderno Digital — organiza tu aula en un solo lugar."
		>
			{view === "request" ? (
				<ForgotPasswordRequestView
					email={email}
					onEmailChange={setEmail}
					onSubmit={send}
					submitting={submitting}
				/>
			) : (
				<ForgotPasswordSentView email={email} resendSeconds={countdown.seconds} onResend={send} />
			)}
		</AuthLayout>
	);
}
