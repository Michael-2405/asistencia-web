import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/shared/ui/button";
import { authClient } from "../lib/auth-client";
import { StatusBanner } from "./StatusBanner";

type Stage = "password" | "scan" | "codes";

export function TwoFactorSetup({ onDone }: { onDone: () => void }) {
	const [stage, setStage] = useState<Stage>("password");
	const [password, setPassword] = useState("");
	const [totpUri, setTotpUri] = useState("");
	const [backupCodes, setBackupCodes] = useState<string[]>([]);
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function onEnable() {
		setError(null);
		const { data, error: enableError } = await authClient.twoFactor.enable({ password });

		if (enableError || !data) {
			setError("Contraseña incorrecta");
			return;
		}

		if (data.method !== "totp") {
			setError("Método de verificación no soportado");
			return;
		}

		setTotpUri(data.totpURI);
		setBackupCodes(data.backupCodes);
		setStage("scan");
	}

	async function onVerify() {
		setError(null);
		const { error: verifyError } = await authClient.twoFactor.verifyTotp({ code });
		if (verifyError) {
			setError("Código inválido");
			return;
		}
		setStage("codes");
	}

	if (stage === "password") {
		return (
			<div className="space-y-4">
				<p className="text-sm text-[#6b6b6b]">
					Confirma tu contraseña para activar la verificación en dos pasos.
				</p>
				{error && <StatusBanner variant="error">{error}</StatusBanner>}
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Contraseña actual"
					className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
				/>
				<Button
					className="w-full bg-[#003087] hover:bg-[#002468]"
					onClick={onEnable}
					disabled={!password}
				>
					Continuar
				</Button>
			</div>
		);
	}

	if (stage === "scan") {
		return (
			<div className="space-y-4">
				{error && <StatusBanner variant="error">{error}</StatusBanner>}
				<div className="flex gap-3">
					<div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[#003087] text-xs font-bold text-white">
						1
					</div>
					<div>
						<div className="text-[13px] font-bold text-[#1a1a1a]">
							Escanea el código QR con tu app de autenticación
						</div>
						<div className="mt-2 w-fit rounded-lg border border-[#E0E0E0] p-2">
							<QRCode value={totpUri} size={140} />
						</div>
					</div>
				</div>
				<div className="flex gap-3">
					<div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[#003087] text-xs font-bold text-white">
						2
					</div>
					<div className="flex-1">
						<div className="text-[13px] font-bold text-[#1a1a1a]">
							Ingresa el código de 6 dígitos
						</div>
						<input
							value={code}
							onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
							placeholder="000000"
							className="mt-2 w-full rounded-lg border-[1.5px] border-[#E0E0E0] py-3 text-center text-xl font-bold tracking-[8px] outline-none focus:border-[#003087]"
						/>
					</div>
				</div>
				<Button
					className="w-full bg-[#003087] hover:bg-[#002468]"
					onClick={onVerify}
					disabled={code.length !== 6}
				>
					Activar
				</Button>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-lg font-bold text-[#2E7D32]">✓ Verificación en dos pasos activada</h3>
			<p className="mt-1.5 text-[13px] text-[#6b6b6b]">
				Guarda estos códigos de recuperación — cada uno se usa una sola vez.
			</p>
			<div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-[#F5F5F5] p-3.5">
				{backupCodes.map((c) => (
					<div key={c} className="font-mono text-[13px] font-semibold tracking-wide text-[#1a1a1a]">
						{c}
					</div>
				))}
			</div>
			<div className="mt-3">
				<StatusBanner variant="warning">
					Guarda estos códigos ahora. No podrás verlos de nuevo.
				</StatusBanner>
			</div>
			<Button className="mt-4 w-full bg-[#003087] hover:bg-[#002468]" onClick={onDone}>
				Entendido
			</Button>
		</div>
	);
}
