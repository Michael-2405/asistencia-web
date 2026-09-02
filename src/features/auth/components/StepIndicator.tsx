interface StepIndicatorProps {
	steps: string[];
	currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
	return (
		<div className="mb-7 flex items-center gap-1.5">
			{steps.map((label, index) => {
				const stepNumber = index + 1;
				const active = currentStep === stepNumber;
				const done = currentStep > stepNumber;

				return (
					<div key={label} className="flex flex-1 items-center gap-1.5">
						<div
							className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
								active || done ? "bg-[#003087] text-white" : "bg-[#F0F0F0] text-[#8a8a8a]"
							}`}
						>
							{done ? "✓" : stepNumber}
						</div>
						<span
							className={`text-[11px] font-semibold ${active ? "text-[#003087]" : done ? "text-[#333]" : "text-[#9a9a9a]"}`}
						>
							{label}
						</span>
						{index < steps.length - 1 && (
							<div className={`ml-1 h-0.5 flex-1 ${done ? "bg-[#003087]" : "bg-[#E0E0E0]"}`} />
						)}
					</div>
				);
			})}
		</div>
	);
}
