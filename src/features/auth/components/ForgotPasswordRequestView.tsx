import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { FIELD_CLASS } from "../constants";

interface ForgotPasswordRequestViewProps {
	email: string;
	onEmailChange: (email: string) => void;
	onSubmit: () => void;
	submitting: boolean;
}

export function ForgotPasswordRequestView({
	email,
	onEmailChange,
	onSubmit,
	submitting,
}: ForgotPasswordRequestViewProps) {
	return (
		<div>
			<h2 className="text-[22px] font-bold text-[#1a1a1a]">¿Olvidaste tu contraseña?</h2>
			<p className="mt-2 text-[13px] font-medium text-[#6b6b6b]">
				Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
			</p>
			<label className="mt-5 flex flex-col gap-1.5">
				<span className="text-xs font-semibold text-[#333]">Correo electrónico</span>
				<input
					type="email"
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					className={FIELD_CLASS}
				/>
			</label>
			<Button
				className="mt-4 w-full bg-[#003087] hover:bg-[#002468]"
				onClick={onSubmit}
				disabled={!email || submitting}
			>
				{submitting ? "Enviando…" : "Enviar enlace"}
			</Button>
			<p className="mt-4 text-center text-xs font-semibold text-[#003087]">
				<Link to="/login">Volver al inicio de sesión</Link>
			</p>
		</div>
	);
}
