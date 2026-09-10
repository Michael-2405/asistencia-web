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
		<div className="flex flex-col gap-4.5">
			<div>
				<h2 className="mb-1.5 text-[22px] font-extrabold text-[#1a1d21]">
					¿Olvidaste tu contraseña?
				</h2>
				<p className="text-[13.5px] leading-relaxed text-[#5b5f66]">
					Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
				</p>
			</div>
			<label className="flex flex-col gap-1.5">
				<span className="text-xs font-bold text-[#1a1d21]">Correo electrónico</span>
				<input
					type="email"
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					placeholder="nombre@escuela.edu.do"
					className={FIELD_CLASS}
				/>
			</label>
			<Button
				onClick={onSubmit}
				disabled={!email || submitting}
				className="bg-[#003087] hover:bg-[#002468]"
			>
				{submitting ? "Enviando…" : "Enviar enlace"}
			</Button>
			<Link to="/login" className="text-center text-[13px] font-semibold text-[#003087]">
				Volver al inicio de sesión
			</Link>
		</div>
	);
}
