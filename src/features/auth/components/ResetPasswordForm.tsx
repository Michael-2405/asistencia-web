import { Button } from "@/shared/ui/button";
import { usePasswordStrength } from "../hooks/usePasswordStrength";
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
	const { strength, color } = usePasswordStrength(newPassword);
	const canSubmit =
		allRequirementsMet(newPassword) &&
		newPassword === confirmNewPassword &&
		confirmNewPassword.length > 0;

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h2 className="mb-1.5 text-[22px] font-extrabold text-[#1a1d21]">Nueva contraseña</h2>
				<p className="text-[13.5px] text-[#5b5f66]">Elige una contraseña nueva para tu cuenta.</p>
			</div>

			{error && <StatusBanner variant="error">{error}</StatusBanner>}

			<label htmlFor="reset-new-password" className="flex flex-col gap-1.5">
				<span className="text-xs font-bold text-[#1a1d21]">Nueva contraseña</span>
				<PasswordInput
					id="reset-new-password"
					value={newPassword}
					onChange={(e) => onNewPasswordChange(e.target.value)}
				/>
				{newPassword.length > 0 && (
					<div className="mt-1 flex gap-1">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className="h-1 flex-1 rounded-full"
								style={{ background: i < strength ? color : "#E0E0E0" }}
							/>
						))}
					</div>
				)}
			</label>

			<label htmlFor="reset-confirm-password" className="flex flex-col gap-1.5">
				<span className="text-xs font-bold text-[#1a1d21]">Confirmar nueva contraseña</span>
				<PasswordInput
					id="reset-confirm-password"
					value={confirmNewPassword}
					onChange={(e) => onConfirmNewPasswordChange(e.target.value)}
				/>
			</label>

			<PasswordRequirementsList password={newPassword} />

			<Button
				onClick={onSubmit}
				disabled={!canSubmit || submitting}
				className="bg-[#003087] hover:bg-[#002468]"
			>
				{submitting ? "Restableciendo…" : "Restablecer contraseña"}
			</Button>
		</div>
	);
}
