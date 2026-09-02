import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { StatusBanner } from "../components/StatusBanner";
import { TwoFactorSetup } from "../components/TwoFactorSetup";
import { authClient, useSession } from "../lib/auth-client";

export function ProfilePage() {
	const { data: session, refetch } = useSession();
	const [changeEmailOpen, setChangeEmailOpen] = useState(false);
	const [changePasswordOpen, setChangePasswordOpen] = useState(false);
	const [setupOpen, setSetupOpen] = useState(false);
	const [disableOpen, setDisableOpen] = useState(false);

	if (!session) return null;

	const twoFactorEnabled = Boolean(
		(session.user as { twoFactorEnabled?: boolean }).twoFactorEnabled,
	);

	return (
		<div className="mx-auto max-w-3xl p-8">
			<h1 className="text-xl font-bold text-[#1a1a1a]">Mi perfil</h1>

			<Tabs defaultValue="account" className="mt-6">
				<TabsList>
					<TabsTrigger value="account">Cuenta</TabsTrigger>
					<TabsTrigger value="security">Seguridad</TabsTrigger>
				</TabsList>

				<TabsContent value="account" className="mt-4">
					<div className="flex flex-col gap-4.5 rounded-lg border border-[#E0E0E0] bg-white p-6">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-xs font-semibold text-[#333]">
									Correo electrónico institucional
								</div>
								<div className="mt-1 text-sm text-[#1a1a1a]">{session.user.email}</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="border-[1.5px] border-[#003087] text-[#003087]"
								onClick={() => setChangeEmailOpen(true)}
							>
								Cambiar correo
							</Button>
						</div>
						<div className="flex items-center justify-between border-t border-[#F0F0F0] pt-4.5">
							<div className="text-xs font-semibold text-[#333]">Contraseña</div>
							<Button
								variant="outline"
								size="sm"
								className="border-[1.5px] border-[#003087] text-[#003087]"
								onClick={() => setChangePasswordOpen(true)}
							>
								Cambiar contraseña
							</Button>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="security" className="mt-4">
					<div className="flex items-center justify-between rounded-lg border border-[#E0E0E0] bg-white p-6">
						<div>
							<div className="text-[13px] font-semibold text-[#333]">Verificación en dos pasos</div>
							<div
								className={`mt-1 text-xs font-bold ${twoFactorEnabled ? "text-[#2E7D32]" : "text-[#9a9a9a]"}`}
							>
								{twoFactorEnabled ? "Activo ✓" : "Inactivo"}
							</div>
						</div>
						{twoFactorEnabled ? (
							<Button
								variant="outline"
								className="border-[1.5px] border-[#f2b3b3] text-[#C62828]"
								onClick={() => setDisableOpen(true)}
							>
								Desactivar
							</Button>
						) : (
							<Button
								className="bg-[#003087] hover:bg-[#002468]"
								onClick={() => setSetupOpen(true)}
							>
								Activar
							</Button>
						)}
					</div>
				</TabsContent>
			</Tabs>

			<ChangeEmailDialog open={changeEmailOpen} onOpenChange={setChangeEmailOpen} />
			<ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
			<DisableTwoFactorDialog
				open={disableOpen}
				onOpenChange={setDisableOpen}
				onDone={() => {
					setDisableOpen(false);
					refetch();
				}}
			/>

			<Dialog open={setupOpen} onOpenChange={setSetupOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Activar verificación en dos pasos</DialogTitle>
					</DialogHeader>
					<TwoFactorSetup
						onDone={() => {
							setSetupOpen(false);
							refetch();
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function ChangeEmailDialog({
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
			setError("No se pudo cambiar el correo");
			return;
		}
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
							placeholder="nuevo.correo@minerd.edu.do"
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

function ChangePasswordDialog({
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
			setError("Contraseña actual incorrecta");
			return;
		}
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
						<input
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							placeholder="Contraseña actual"
							className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
						/>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="Nueva contraseña"
							className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
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

function DisableTwoFactorDialog({
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
			setError("Contraseña incorrecta");
			return;
		}
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
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Contraseña actual"
						className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
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
