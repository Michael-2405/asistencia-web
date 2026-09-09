import { useCountdownFrom } from "@/shared/hooks/useCountdownFrom";
import { MaintenanceIcon } from "../components/icons/MaintenanceIcon";

const ESTIMATED_MINUTES = 45;

export function MaintenancePage() {
	const { formatted } = useCountdownFrom(ESTIMATED_MINUTES * 60);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6.5 bg-[#F5F5F5] p-10">
			<div className="flex items-center gap-3">
				<div className="flex h-9.5 w-9.5 items-center justify-center rounded-[9px] bg-[#003087] text-[17px] font-extrabold text-white">
					CD
				</div>
				<span className="text-[17px] font-extrabold text-[#003087]">Cuaderno Digital</span>
			</div>

			<div className="flex max-w-115 flex-col items-center gap-4 rounded-[14px] border border-[#E0E0E0] bg-white p-10 text-center">
				<MaintenanceIcon />
				<h1 className="text-[22px] font-extrabold text-[#1a1d21]">
					El sistema está en mantenimiento
				</h1>
				<p className="text-sm leading-relaxed text-[#5b5f66]">
					Estamos realizando mejoras para ofrecerte una mejor experiencia. Volveremos pronto.
				</p>
				<div className="rounded-lg bg-[#F5F5F5] px-4.5 py-2.5 text-[13px] font-bold text-[#003087]">
					Tiempo estimado: {formatted}
				</div>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-1 rounded-lg bg-[#003087] px-5.5 py-2.5 text-[13.5px] font-bold text-white"
				>
					Actualizar página
				</button>
			</div>

			<span className="text-xs text-[#8a8f98]">
				¿Necesitas ayuda? Escríbenos a{" "}
				<a href="mailto:soporte@cuadernodigital.edu.do" className="no-underline">
					soporte@cuadernodigital.edu.do
				</a>
			</span>
		</div>
	);
}
