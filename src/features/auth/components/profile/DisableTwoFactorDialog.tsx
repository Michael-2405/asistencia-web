import { useState } from "react";
import { toast } from "sonner";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { authClient } from "../../lib/auth-client";
import { PasswordInput } from "../shared/PasswordInput";
import { StatusBanner } from "../shared/StatusBanner";

const logger = createLogger("DisableTwoFactorDialog");

export function DisableTwoFactorDialog({
	open,
	onOpenChange,
	onDone,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	onDone: () => void;
}) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function submit() {
		setError(null);
		const { error: disableError } = await authClient.twoFactor.disable({ password });
		if (disableError) {
			logger.warn("Falló desactivación de 2FA: contraseña incorrecta");
			setError("Contraseña incorrecta");
			return;
		}
		logger.info("2FA desactivado");
		toast.success("Verificación en dos pasos desactivada");
		onDone();
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Desactivar verificación en dos pasos</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<StatusBanner variant="error">
						Desactivar el doble factor reduce la seguridad de tu cuenta.
					</StatusBanner>
					<PasswordInput
						id="disable-2fa-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Contraseña actual"
					/>
					{error && <span className="text-xs text-[#C62828]">{error}</span>}
					<Button
						className="w-full bg-[#C62828] hover:bg-[#a92020]"
						onClick={submit}
						disabled={!password}
					>
						Desactivar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
