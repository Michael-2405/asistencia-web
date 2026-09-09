import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { EmailSentHeader } from "./EmailSentHeader";

interface ForgotPasswordSentViewProps {
	email: string;
	resendSeconds: number;
	onResend: () => void;
}

export function ForgotPasswordSentView({
	email,
	resendSeconds,
	onResend,
}: ForgotPasswordSentViewProps) {
	const canResend = resendSeconds === 0;

	return (
		<div className="text-center">
			<EmailSentHeader
				title="Revisa tu correo"
				description={`Enviamos un enlace a ${email}. El enlace expira en 30 minutos.`}
			/>
			<Button
				variant="outline"
				disabled={!canResend}
				onClick={onResend}
				className="mt-5 w-full border-[1.5px] border-[#003087] text-[#003087] disabled:border-[#E0E0E0] disabled:text-[#b0b0b0]"
			>
				{canResend ? "Reenviar correo" : `Reenviar correo (${resendSeconds}s)`}
			</Button>
			<p className="mt-4 text-center text-xs font-semibold text-[#003087]">
				<Link to="/login">Volver al inicio de sesión</Link>
			</p>
		</div>
	);
}
