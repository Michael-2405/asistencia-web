export function PendingAttendanceBanner({ pendingCount }: { pendingCount: number }) {
	if (pendingCount === 0) return null;

	const text =
		pendingCount === 1
			? "Tienes 1 curso con la asistencia de hoy pendiente de registrar."
			: `Tienes ${pendingCount} cursos con la asistencia de hoy pendiente de registrar.`;

	return (
		<div className="flex items-center gap-2.5 rounded-[9px] border border-[#F7CFA0] bg-[#FFF4E8] px-4.5 py-3.5 text-[13.5px] text-[#8a4b00]">
			<span className="text-base">⚠</span>
			<span>{text}</span>
		</div>
	);
}
