import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { StatusBanner } from "../shared/StatusBanner";

interface TwoFactorVerifyFormProps {
	onSubmit: (code: string, useBackupCode: boolean) => Promise<void>;
	verifying: boolean;
	error: string | null;
}

export function TwoFactorVerifyForm({ onSubmit, verifying, error }: TwoFactorVerifyFormProps) {
	const [code, setCode] = useState("");
	const [useBackupCode, setUseBackupCode] = useState(false);

	function toggleMode() {
		setUseBackupCode((v) => !v);
		setCode("");
	}

	return (
		<div>
			<h2 className="text-2xl font-bold text-[#1a1a1a]">Verificación en dos pasos</h2>
			<p className="mt-1.5 text-[13px] font-medium text-[#6b6b6b]">
				{useBackupCode
					? "Ingresa uno de tus códigos de recuperación"
					: "Ingresa el código de tu app de autenticación"}
			</p>

			{error && (
				<div className="mt-5">
					<StatusBanner variant="error">{error}</StatusBanner>
				</div>
			)}

			<div className="mt-6 flex flex-col gap-4">
				<input
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder={useBackupCode ? "XXXXX-XXXXX" : "000000"}
					maxLength={useBackupCode ? undefined : 6}
					className="w-full rounded-lg border-[1.5px] border-[#E0E0E0] py-3.5 text-center font-bold text-2xl tracking-[6px] outline-none focus:border-[#003087]"
				/>
				<Button
					type="button"
					onClick={() => onSubmit(code, useBackupCode)}
					disabled={!code || verifying}
					className="w-full bg-[#003087] hover:bg-[#002468]"
				>
					{verifying ? "Verificando…" : "Verificar"}
				</Button>
				<button
					type="button"
					onClick={toggleMode}
					className="text-center text-xs font-semibold text-[#003087]"
				>
					{useBackupCode ? "Usar código de la app" : "Usar código de recuperación"}
				</button>
			</div>
		</div>
	);
}
