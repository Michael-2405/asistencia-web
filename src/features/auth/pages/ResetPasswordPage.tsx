import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { AuthLayout } from "../components/AuthLayout";
import { StatusBanner } from "../components/StatusBanner";
import { authClient } from "../lib/auth-client";

export function ResetPasswordPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get("token");

	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [done, setDone] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const requirements = [
		{ text: "Mínimo 8 caracteres", ok: newPassword.length >= 8 },
		{ text: "Una mayúscula", ok: /[A-Z]/.test(newPassword) },
		{ text: "Un número", ok: /[0-9]/.test(newPassword) },
	];

	async function onReset() {
		setError(null);

		if (!token) {
			setError("Enlace inválido o expirado");
			return;
		}
		if (newPassword !== confirmNewPassword) {
			setError("Las contraseñas no coinciden");
			return;
		}

		const { error: resetError } = await authClient.resetPassword({ newPassword, token });
		if (resetError) {
			setError("No se pudo restablecer la contraseña. El enlace pudo haber expirado.");
			return;
		}
		setDone(true);
	}

	return (
		<AuthLayout
			tagline="Crea una nueva contraseña"
			footerNote="Sistema oficial de registro escolar"
		>
			{done ? (
				<div className="text-center">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6ee] text-2xl font-bold text-[#2E7D32]">
						✓
					</div>
					<h2 className="mt-4 text-xl font-bold text-[#1a1a1a]">Contraseña actualizada</h2>
					<p className="mt-2 text-[13px] font-medium text-[#6b6b6b]">
						Ya puedes iniciar sesión con tu nueva contraseña.
					</p>
					<Button
						className="mt-5 w-full bg-[#003087] hover:bg-[#002468]"
						onClick={() => navigate("/login")}
					>
						Ir al inicio de sesión
					</Button>
				</div>
			) : (
				<div>
					<h2 className="text-[22px] font-bold text-[#1a1a1a]">Nueva contraseña</h2>
					<p className="mt-1.5 text-[13px] font-medium text-[#6b6b6b]">
						Crea una nueva contraseña para tu cuenta.
					</p>

					{error && (
						<div className="mt-4">
							<StatusBanner variant="error">{error}</StatusBanner>
						</div>
					)}

					<label className="mt-5 flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Nueva contraseña</span>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
						/>
					</label>

					<div className="mt-2.5 flex flex-col gap-1">
						{requirements.map((r) => (
							<div
								key={r.text}
								className="flex items-center gap-1.5 text-xs font-medium"
								style={{ color: r.ok ? "#2E7D32" : "#9a9a9a" }}
							>
								<span>{r.ok ? "✓" : "○"}</span>
								<span>{r.text}</span>
							</div>
						))}
					</div>

					<label className="mt-3.5 flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Confirmar nueva contraseña</span>
						<input
							type="password"
							value={confirmNewPassword}
							onChange={(e) => setConfirmNewPassword(e.target.value)}
							className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
						/>
					</label>

					<Button className="mt-4.5 w-full bg-[#003087] hover:bg-[#002468]" onClick={onReset}>
						Restablecer contraseña
					</Button>
				</div>
			)}
		</AuthLayout>
	);
}
