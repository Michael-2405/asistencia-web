import { useState } from "react";
import { toast } from "sonner";
import { useCountdown } from "@/shared/hooks/useCountdown";
import { createLogger } from "@/shared/lib/logger";
import { ForgotPasswordRequestView } from "../components/reset-password/ForgotPasswordRequestView";
import { ForgotPasswordSentView } from "../components/reset-password/ForgotPasswordSentView";
import { AuthLayout } from "../components/shared/AuthLayout";
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
			title="Recupera el acceso a tu cuenta"
			subtitle="Te ayudamos a restablecer tu contraseña de forma segura."
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
