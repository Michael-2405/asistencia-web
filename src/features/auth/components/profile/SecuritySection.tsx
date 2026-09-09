import { Button } from "@/shared/ui/button";
import { SessionsList } from "../SessionsList";

interface SecuritySectionProps {
	twoFactorEnabled: boolean;
	onEnable: () => void;
	onDisable: () => void;
}

export function SecuritySection({ twoFactorEnabled, onEnable, onDisable }: SecuritySectionProps) {
	return (
		<div className="flex flex-col gap-4 rounded-[11px] border border-[#E0E0E0] bg-white p-6">
			<h2 className="text-base font-extrabold text-[#1a1d21]">Seguridad</h2>

			<div className="flex items-center justify-between border-b border-[#F0F0F0] pb-4">
				<div>
					<div className="mb-1 text-[13.5px] text-[#5b5f66]">Verificación en dos pasos</div>
					<span
						className={`text-[13px] font-bold ${twoFactorEnabled ? "text-[#2E7D32]" : "text-[#9a9a9a]"}`}
					>
						{twoFactorEnabled ? "Activo ✓" : "Inactivo"}
					</span>
				</div>
				{twoFactorEnabled ? (
					<Button
						variant="outline"
						size="sm"
						className="border-[1.5px] border-[#C62828] text-[#C62828]"
						onClick={onDisable}
					>
						Desactivar
					</Button>
				) : (
					<Button size="sm" className="bg-[#003087] hover:bg-[#002468]" onClick={onEnable}>
						Activar
					</Button>
				)}
			</div>

			<SessionsList />
		</div>
	);
}
