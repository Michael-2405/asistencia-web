import { Button } from "@/shared/ui/button";

export function DangerZoneSection({ onSuspend }: { onSuspend: () => void }) {
	return (
		<div className="flex flex-col gap-3.5 rounded-[11px] border-[1.5px] border-[#F3B8B4] bg-white p-6">
			<h2 className="text-base font-extrabold text-[#C62828]">Zona de peligro</h2>
			<p className="text-[13px] leading-relaxed text-[#5b5f66]">
				Al suspender tu cuenta, tendrás un periodo de gracia de 30 días para reactivarla. Pasado ese
				plazo, la cuenta y sus datos se eliminarán de forma definitiva.
			</p>
			<Button className="self-start bg-[#C62828] hover:bg-[#a92020]" onClick={onSuspend}>
				Suspender cuenta
			</Button>
		</div>
	);
}
