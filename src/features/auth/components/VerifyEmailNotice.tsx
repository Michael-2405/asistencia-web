import { useLocation } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { authClient } from "../lib/auth-client";
import { AuthLayout } from "./AuthLayout";

export function VerifyEmailNotice() {
	const location = useLocation();
	const email = (location.state as { email?: string } | null)?.email;

	async function resend() {
		if (!email) return;
		await authClient.sendVerificationEmail({ email, callbackURL: "/login" });
	}

	return (
		<AuthLayout tagline="Confirma tu cuenta" footerNote="Sistema oficial de registro escolar">
			<div className="text-center">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3fb] text-2xl">
					✉️
				</div>
				<h2 className="mt-4 text-[22px] font-bold text-[#1a1a1a]">Revisa tu correo</h2>
				<p className="mt-2 text-[13px] font-medium text-[#6b6b6b]">
					Te enviamos un enlace de verificación{email ? ` a ${email}` : ""}. Confírmalo para poder
					iniciar sesión.
				</p>
				{email && (
					<Button
						variant="outline"
						onClick={resend}
						className="mt-5 w-full border-[1.5px] border-[#003087] text-[#003087]"
					>
						Reenviar correo
					</Button>
				)}
			</div>
		</AuthLayout>
	);
}
