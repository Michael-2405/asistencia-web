import { useState } from "react";
import { toast } from "sonner";
import { createLogger } from "@/shared/lib/logger";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { authClient } from "../../lib/auth-client";
import { StatusBanner } from "../shared/StatusBanner";

const logger = createLogger("ChangeEmailDialog");

export function ChangeEmailDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	const [newEmail, setNewEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [sent, setSent] = useState(false);

	async function submit() {
		setError(null);
		const { error: changeError } = await authClient.changeEmail({
			newEmail,
			callbackURL: "/profile",
		});
		if (changeError) {
			logger.warn("Falló cambio de correo");
			setError("No se pudo cambiar el correo");
			return;
		}
		logger.info("Solicitud de cambio de correo enviada");
		toast.success("Revisa tu nuevo correo para confirmar el cambio");
		setSent(true);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cambiar correo</DialogTitle>
				</DialogHeader>
				{sent ? (
					<StatusBanner variant="success">
						Revisa tu nuevo correo para confirmar el cambio.
					</StatusBanner>
				) : (
					<div className="space-y-3">
						{error && <StatusBanner variant="error">{error}</StatusBanner>}
						<input
							type="email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
							placeholder="nuevo.correo@escuela.edu.do"
							className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
						/>
						<Button
							className="w-full bg-[#003087] hover:bg-[#002468]"
							onClick={submit}
							disabled={!newEmail}
						>
							Enviar confirmación
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
