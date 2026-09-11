interface PillSelectorProps<T extends string> {
	options: readonly T[];
	value: T | undefined;
	onChange: (value: T) => void;
	getLabel?: (option: T) => string;
	shape?: "pill" | "rounded";
	selectedStyle?: "solid" | "tinted";
}

export function PillSelector<T extends string>({
	options,
	value,
	onChange,
	getLabel,
	shape = "rounded",
	selectedStyle = "solid",
}: PillSelectorProps<T>) {
	const shapeClass = shape === "pill" ? "rounded-full px-4 py-2" : "flex-1 rounded-lg py-2.5";
	const selectedClass =
		selectedStyle === "solid"
			? "border-[#003087] bg-[#003087] text-white"
			: "border-[#003087] bg-[#EEF2FB] text-[#003087]";

	return (
		<div className="flex flex-wrap gap-2">
			{options.map((option) => (
				<button
					key={option}
					type="button"
					onClick={() => onChange(option)}
					className={`border-[1.5px] text-[13px] font-bold ${shapeClass} ${value === option ? selectedClass : "border-[#d5d8dc] text-[#5b5f66]"}`}
				>
					{getLabel ? getLabel(option) : option}
				</button>
			))}
		</div>
	);
}
