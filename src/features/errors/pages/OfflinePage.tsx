import { Button } from "@/shared/ui/button";
import { OfflineIcon } from "../components/icons/OfflineIcon";

export function OfflinePage() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4.5 p-10 text-center">
			<OfflineIcon />
			<div className="flex flex-col gap-2.5">
				<h1 className="text-[22px] font-extrabold text-[#1a1d21]">Sin conexión a internet</h1>
				<p className="max-w-105 text-sm leading-relaxed text-[#5b5f66]">
					Verifica tu conexión e intenta de nuevo. Los datos que ya cargaron siguen disponibles.
				</p>
			</div>
			<Button className="bg-[#003087] hover:bg-[#002468]" onClick={() => window.location.reload()}>
				Intentar de nuevo
			</Button>
		</div>
	);
}
