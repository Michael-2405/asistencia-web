import { useState } from "react";
import QRCode from "react-qr-code";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { authClient } from "../lib/auth-client";
import { StatusBanner } from "./StatusBanner";

type Stage = "password" | "scan" | "codes";
const logger = createLogger("TwoFactorSetup");

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
			logger.warn("Falló activación de 2FA: contraseña incorrecta");
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
			logger.warn("Falló verificación TOTP al activar 2FA");
			setError(
				"Código inválido o expirado. Espera a que la app genere uno nuevo e inténtalo de nuevo.",
			);
			return;
		}
		logger.info("2FA activado exitosamente");
		setStage("codes");
	}

	function downloadCodes() {
		const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "codigos-recuperacion-cuaderno-digital.txt";
		a.click();
		URL.revokeObjectURL(url);
		logger.info("Códigos de recuperación descargados");
	}

	if (stage === "password") {
		return (
			<div className="flex flex-col gap-5">
				<p className="text-[13.5px] leading-relaxed text-[#5b5f66]">
					Agrega una capa extra de seguridad a tu cuenta.
				</p>
				{error && <StatusBanner variant="error">{error}</StatusBanner>}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-bold text-[#1a1d21]" htmlFor="2fa-password">
						Contraseña actual
					</label>
					<input
						id="2fa-password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="rounded-lg border-[1.5px] border-[#d5d8dc] px-3.5 py-2.5 text-sm outline-none focus:border-[#003087]"
					/>
				</div>
				<Button className="bg-[#003087] hover:bg-[#002468]" onClick={onEnable} disabled={!password}>
					Continuar
				</Button>
			</div>
		);
	}

	if (stage === "scan") {
		return (
			<div className="flex flex-col gap-5">
				{error && <StatusBanner variant="error">{error}</StatusBanner>}

				<div className="flex gap-3">
					<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003087] text-xs font-extrabold text-white">
						1
					</div>
					<div className="flex flex-col gap-2">
						<span className="text-[13.5px] font-bold text-[#1a1d21]">
							Descarga la app de autenticación
						</span>
						<div className="flex gap-2">
							<span className="flex items-center gap-1.5 rounded-[7px] border border-[#E0E0E0] px-3 py-1.5 text-xs text-[#5b5f66]">
								📱 Google Authenticator
							</span>
							<span className="flex items-center gap-1.5 rounded-[7px] border border-[#E0E0E0] px-3 py-1.5 text-xs text-[#5b5f66]">
								📱 Authy
							</span>
						</div>
					</div>
				</div>

				<div className="flex gap-3">
					<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003087] text-xs font-extrabold text-white">
						2
					</div>
					<div className="flex flex-col items-start gap-2">
						<span className="text-[13.5px] font-bold text-[#1a1d21]">Escanea el código QR</span>
						<div className="w-fit rounded-lg border border-[#E0E0E0] p-2">
							<QRCode value={totpUri} size={150} />
						</div>
					</div>
				</div>

				<div className="flex gap-3">
					<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003087] text-xs font-extrabold text-white">
						3
					</div>
					<div className="flex flex-1 flex-col gap-2">
						<span className="text-[13.5px] font-bold text-[#1a1d21]">
							Ingresa el código de 6 dígitos
						</span>
						<input
							value={code}
							onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
							placeholder="000000"
							className="w-50 rounded-lg border-[1.5px] border-[#d5d8dc] px-3.5 py-2.5 text-center text-2xl font-extrabold tracking-[8px] outline-none focus:border-[#003087]"
						/>
					</div>
				</div>

				<Button
					className="bg-[#003087] hover:bg-[#002468]"
					onClick={onVerify}
					disabled={code.length !== 6}
				>
					Activar
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3.5">
			<div className="flex items-center gap-2 text-[13.5px] font-bold text-[#2E7D32]">
				<span>✓</span> Verificación en dos pasos activada
			</div>

			<StatusBanner variant="warning">
				Guarda estos códigos de recuperación en un lugar seguro. Cada uno solo puede usarse una vez
				si pierdes acceso a tu app de autenticación.
			</StatusBanner>

			<div className="grid grid-cols-2 gap-2 rounded-lg bg-[#F5F5F5] p-3.5">
				{backupCodes.map((c) => (
					<span key={c} className="font-mono text-[13px] font-semibold text-[#1a1d21]">
						{c}
					</span>
				))}
			</div>

			<Button className="bg-[#003087] hover:bg-[#002468]" onClick={downloadCodes}>
				Descargar códigos
			</Button>
			<Button
				variant="outline"
				className="border-[1.5px] border-[#d5d8dc] text-[#5b5f66]"
				onClick={onDone}
			>
				Entendido
			</Button>
		</div>
	);
}
