import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { AuthLayout } from "../components/AuthLayout";
import { authClient } from "../lib/auth-client";

const FIELD_CLASS =
	"rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#003087] w-full box-border";

export function ForgotPasswordPage() {
	const [view, setView] = useState<"request" | "sent">("request");
	const [email, setEmail] = useState("");
	const [seconds, setSeconds] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

	function startCountdown() {
		clearInterval(intervalRef.current);
		setSeconds(60);
		intervalRef.current = setInterval(() => {
			setSeconds((s) => {
				if (s <= 1) {
					clearInterval(intervalRef.current);
					return 0;
				}
				return s - 1;
			});
		}, 1000);
	}

	useEffect(() => () => clearInterval(intervalRef.current), []);

	async function send() {
		await authClient.requestPasswordReset({
			email,
			redirectTo: `${window.location.origin}/reset-password`,
		});
		setView("sent");
		startCountdown();
	}

	return (
		<AuthLayout
			tagline="Recupera el acceso a tu cuenta"
			footerNote="Sistema oficial de registro escolar"
		>
			{view === "request" ? (
				<div>
					<h2 className="text-[22px] font-bold text-[#1a1a1a]">¿Olvidaste tu contraseña?</h2>
					<p className="mt-2 text-[13px] font-medium text-[#6b6b6b]">
						Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu
						contraseña.
					</p>
					<label className="mt-5 flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Correo electrónico</span>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={FIELD_CLASS}
						/>
					</label>
					<Button
						className="mt-4 w-full bg-[#003087] hover:bg-[#002468]"
						onClick={send}
						disabled={!email}
					>
						Enviar enlace
					</Button>
					<p className="mt-4 text-center text-xs font-semibold text-[#003087]">
						<Link to="/login">Volver al inicio de sesión</Link>
					</p>
				</div>
			) : (
				<div className="text-center">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3fb] text-2xl">
						✉️
					</div>
					<h2 className="mt-4 text-[22px] font-bold text-[#1a1a1a]">Revisa tu correo</h2>
					<p className="mt-2 text-[13px] font-medium text-[#6b6b6b]">
						Enviamos un enlace a <b className="text-[#1a1a1a]">{email}</b>. El enlace expira en 30
						minutos.
					</p>
					<Button
						variant="outline"
						disabled={seconds > 0}
						onClick={send}
						className="mt-5 w-full border-[1.5px] border-[#003087] text-[#003087] disabled:border-[#E0E0E0] disabled:text-[#b0b0b0]"
					>
						{seconds > 0 ? `Reenviar correo (${seconds}s)` : "Reenviar correo"}
					</Button>
					<p className="mt-4 text-center text-xs font-semibold text-[#003087]">
						<Link to="/login">Volver al inicio de sesión</Link>
					</p>
				</div>
			)}
		</AuthLayout>
	);
}
