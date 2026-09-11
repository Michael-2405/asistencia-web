import { useState } from "react";
import { toast } from "sonner";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { authClient } from "../../lib/auth-client";
import { PasswordInput } from "../shared/PasswordInput";
import { StatusBanner } from "../shared/StatusBanner";

const logger = createLogger("ChangePasswordDialog");

export function ChangePasswordDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [done, setDone] = useState(false);

	async function submit() {
		setError(null);
		const { error: changeError } = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true,
		});
		if (changeError) {
			logger.warn("Falló cambio de contraseña: contraseña actual incorrecta");
			setError("Contraseña actual incorrecta");
			return;
		}
		logger.info("Contraseña actualizada");
		toast.success("Contraseña actualizada correctamente");
		setDone(true);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cambiar contraseña</DialogTitle>
				</DialogHeader>
				{done ? (
					<StatusBanner variant="success">Contraseña actualizada correctamente.</StatusBanner>
				) : (
					<div className="space-y-3">
						{error && <StatusBanner variant="error">{error}</StatusBanner>}
						<PasswordInput
							id="change-current-password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							placeholder="Contraseña actual"
						/>
						<PasswordInput
							id="change-new-password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="Nueva contraseña"
						/>
						<Button
							className="w-full bg-[#003087] hover:bg-[#002468]"
							onClick={submit}
							disabled={!currentPassword || !newPassword}
						>
							Cambiar contraseña
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
