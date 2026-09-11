const OPTIONS = [
	{ value: true, title: "Sí — Docente encargado", desc: "Imparto las materias troncales" },
	{ value: false, title: "No — Docente de área", desc: "Imparto una materia específica" },
] as const;

export function HomeroomToggle({
	value,
	onChange,
}: {
	value: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			{OPTIONS.map((opt) => (
				<button
					key={String(opt.value)}
					type="button"
					onClick={() => onChange(opt.value)}
					className={`rounded-lg border-[1.5px] p-3 text-left ${value === opt.value ? "border-[#003087] bg-[#EEF2FB]" : "border-[#d5d8dc]"}`}
				>
					<div className="text-[13.5px] font-bold text-[#1a1d21]">{opt.title}</div>
					<div className="mt-0.5 text-xs text-[#5b5f66]">{opt.desc}</div>
				</button>
			))}
		</div>
	);
}
