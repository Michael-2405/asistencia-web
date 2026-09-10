import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";

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
		<div className="flex flex-col items-center gap-3.5 py-3.5 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EEF9] text-2xl">
				✉
			</div>
			<h2 className="text-[21px] font-extrabold text-[#1a1d21]">Revisa tu correo</h2>
			<p className="max-w-[320px] text-[13.5px] leading-relaxed text-[#5b5f66]">
				Enviamos un enlace a <strong>{email}</strong>. El enlace expira en 30 minutos.
			</p>
			<Button
				variant="outline"
				disabled={!canResend}
				onClick={onResend}
				className="border-[1.5px] border-[#003087] text-[#003087] disabled:border-[#E0E0E0] disabled:text-[#a8adb5]"
			>
				{canResend ? "Reenviar correo" : `Reenviar correo (${resendSeconds}s)`}
			</Button>
			<Link to="/login" className="text-[13px] font-semibold text-[#003087]">
				Volver al inicio de sesión
			</Link>
		</div>
	);
}
