import { Button } from "@/shared/ui/button";
import { PasswordInput } from "./PasswordInput";
import { allRequirementsMet, PasswordRequirementsList } from "./PasswordRequirementsList";
import { StatusBanner } from "./StatusBanner";

interface ResetPasswordFormProps {
	newPassword: string;
	confirmNewPassword: string;
	onNewPasswordChange: (v: string) => void;
	onConfirmNewPasswordChange: (v: string) => void;
	onSubmit: () => void;
	error: string | null;
	submitting: boolean;
}

export function ResetPasswordForm({
	newPassword,
	confirmNewPassword,
	onNewPasswordChange,
	onConfirmNewPasswordChange,
	onSubmit,
	error,
	submitting,
}: ResetPasswordFormProps) {
	const canSubmit =
		allRequirementsMet(newPassword) &&
		newPassword === confirmNewPassword &&
		confirmNewPassword.length > 0;

	return (
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

			<label htmlFor="reset-new-password" className="mt-5 flex flex-col gap-1.5">
				<span className="text-xs font-semibold text-[#333]">Nueva contraseña</span>
				<PasswordInput
					id="reset-new-password"
					value={newPassword}
					onChange={(e) => onNewPasswordChange(e.target.value)}
				/>
			</label>

			<PasswordRequirementsList password={newPassword} />

			<label htmlFor="reset-confirm-password" className="mt-3.5 flex flex-col gap-1.5">
				<span className="text-xs font-semibold text-[#333]">Confirmar nueva contraseña</span>
				<PasswordInput
					id="reset-confirm-password"
					value={confirmNewPassword}
					onChange={(e) => onConfirmNewPasswordChange(e.target.value)}
				/>
			</label>

			<Button
				className="mt-4.5 w-full bg-[#003087] hover:bg-[#002468]"
				onClick={onSubmit}
				disabled={!canSubmit || submitting}
			>
				{submitting ? "Restableciendo…" : "Restablecer contraseña"}
			</Button>
		</div>
	);
}
