export function AttendanceLegend() {
	return (
		<div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
			<LegendItem colorClass="bg-green-100 text-green-700" label="Presente" symbol="P" />
			<LegendItem colorClass="bg-red-100 text-red-700" label="Ausente" symbol="A" />
			<LegendItem colorClass="bg-amber-100 text-amber-700" label="Tarde" symbol="T" />
			<LegendItem colorClass="bg-blue-100 text-blue-700" label="Excusa" symbol="E" />
			<span className="flex items-center gap-1.5">
				<span className="inline-block h-3 w-3 rounded-full bg-slate-400" />
				Día bloqueado (pasado/futuro)
			</span>
			<span className="flex items-center gap-1.5">
				<span className="inline-block h-3 w-3 rounded-full border-2 border-red-400" />
				Día no laborable
			</span>
		</div>
	);
}

function LegendItem({
	colorClass,
	label,
	symbol,
}: {
	colorClass: string;
	label: string;
	symbol: string;
}) {
	return (
		<span className="flex items-center gap-1.5">
			<span
				className={`inline-flex h-4 w-4 items-center justify-center rounded text-[10px] font-medium ${colorClass}`}
			>
				{symbol}
			</span>
			{label}
		</span>
	);
}
