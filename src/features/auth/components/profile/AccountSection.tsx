import { Button } from "@/shared/ui/button";

interface AccountSectionProps {
	email: string;
	onChangeEmail: () => void;
	onChangePassword: () => void;
}

export function AccountSection({ email, onChangeEmail, onChangePassword }: AccountSectionProps) {
	return (
		<div className="flex flex-col gap-4.5 rounded-[11px] border border-[#E0E0E0] bg-white p-6">
			<h2 className="text-base font-extrabold text-[#1a1d21]">Información de cuenta</h2>

			<div className="flex items-center justify-between gap-3 border-b border-[#F0F0F0] pb-4">
				<div>
					<div className="mb-0.5 text-xs text-[#8a8f98]">Correo electrónico</div>
					<div className="text-sm font-semibold text-[#1a1d21]">{email}</div>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="border-[1.5px] border-[#003087] text-[#003087]"
					onClick={onChangeEmail}
				>
					Cambiar correo
				</Button>
			</div>

			<div className="flex items-center justify-between gap-3">
				<div className="text-xs font-semibold text-[#333]">Contraseña</div>
				<Button
					variant="outline"
					size="sm"
					className="border-[1.5px] border-[#003087] text-[#003087]"
					onClick={onChangePassword}
				>
					Cambiar contraseña
				</Button>
			</div>
		</div>
	);
}
