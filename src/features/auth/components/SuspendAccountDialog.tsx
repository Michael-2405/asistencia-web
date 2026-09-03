import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useSuspendAccount } from "../hooks";
import { authClient } from "../lib/auth-client";
import { StatusBanner } from "./StatusBanner";

export function SuspendAccountDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	const navigate = useNavigate();
	const suspendMutation = useSuspendAccount();
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function onConfirm() {
		setError(null);
		try {
			await suspendMutation.mutateAsync(password);
			await authClient.signOut();
			navigate("/login");
		} catch (e) {
			setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-105">
				<DialogHeader>
					<DialogTitle>Suspender cuenta</DialogTitle>
				</DialogHeader>

				<div className="rounded-lg border border-[#f2b3b3] bg-[#fdeeee] p-3.5 text-xs font-medium leading-relaxed text-[#C62828]">
					Tu cuenta no se elimina de inmediato. Tendrás <b>30 días</b> para reactivarla iniciando
					sesión de nuevo. Pasado ese plazo, quedará eliminada permanentemente.
				</div>

				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-semibold text-[#333]">Confirma tu contraseña</span>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
					/>
				</label>

				{error && <StatusBanner variant="error">{error}</StatusBanner>}

				<div className="flex gap-2.5">
					<Button
						variant="outline"
						className="flex-1 border-[#E0E0E0] text-[#6b6b6b]"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						className="flex-2 bg-[#C62828] hover:bg-[#a92020]"
						disabled={!password || suspendMutation.isPending}
						onClick={onConfirm}
					>
						Suspender mi cuenta
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
