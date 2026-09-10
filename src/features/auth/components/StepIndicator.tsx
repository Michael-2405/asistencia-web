interface StepIndicatorProps {
	steps: string[];
	currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
	return (
		<div className="flex items-center gap-2.5">
			{steps.map((label, index) => {
				const num = index + 1;
				const active = currentStep >= num;
				return (
					<div key={label} className={`flex items-center gap-2.5 ${num === 1 ? "" : "flex-1"}`}>
						<div
							className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${active ? "bg-[#003087] text-white" : "bg-[#E0E0E0] text-[#8a8f98]"}`}
						>
							{num}
						</div>
						<span
							className={`whitespace-nowrap text-[12.5px] font-bold ${active ? "text-[#1a1d21]" : "text-[#a8adb5]"}`}
						>
							{label}
						</span>
						{num === 1 && (
							<div
								className={`h-0.5 flex-1 ${currentStep >= 2 ? "bg-[#003087]" : "bg-[#E0E0E0]"}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
