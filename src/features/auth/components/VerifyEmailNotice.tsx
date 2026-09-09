import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useCountdown } from "@/shared/hooks/useCountdown";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { authClient } from "../lib/auth-client";
import { AuthLayout } from "./AuthLayout";
import { EmailSentHeader } from "./EmailSentHeader";

const RESEND_COOLDOWN_SECONDS = 60;
const logger = createLogger("VerifyEmailNotice");

export function VerifyEmailNotice() {
	const location = useLocation();
	const email = (location.state as { email?: string } | null)?.email;
	const countdown = useCountdown(RESEND_COOLDOWN_SECONDS);

	async function resend() {
		if (!email) return;

		const { error: sendError } = await authClient.sendVerificationEmail({
			email,
			callbackURL: "/login",
		});

		if (sendError) {
			logger.error("Falló el reenvío del correo de verificación", sendError);
			toast.error("No se pudo reenviar el correo. Verifica tu conexión e intenta de nuevo.");
			return;
		}

		logger.info("Correo de verificación reenviado");
		toast.success("Correo de verificación reenviado");
		countdown.start();
	}

	return (
		<AuthLayout
			tagline="Confirma tu cuenta"
			footerNote="Cuaderno Digital — organiza tu aula en un solo lugar."
		>
			<div className="text-center">
				<EmailSentHeader
					title="Revisa tu correo"
					description={`Te enviamos un enlace de verificación${email ? ` a ${email}` : ""}. Confírmalo para poder iniciar sesión.`}
				/>
				{email && (
					<Button
						variant="outline"
						onClick={resend}
						disabled={countdown.isActive}
						className="mt-5 w-full border-[1.5px] border-[#003087] text-[#003087] disabled:border-[#E0E0E0] disabled:text-[#b0b0b0]"
					>
						{countdown.isActive ? `Reenviar correo (${countdown.seconds}s)` : "Reenviar correo"}
					</Button>
				)}
			</div>
		</AuthLayout>
	);
}
