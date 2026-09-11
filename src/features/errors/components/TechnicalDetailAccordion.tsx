import { useState } from "react";

interface TechnicalDetailAccordionProps {
	message: string;
	requestId?: string;
}

export function TechnicalDetailAccordion({ message, requestId }: TechnicalDetailAccordionProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative z-10 w-full">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between rounded-lg bg-[#F5F5F5] px-3.5 py-2.5 text-left text-xs font-bold text-[#5b5f66]"
			>
				Detalle técnico <span>{open ? "▲" : "▼"}</span>
			</button>
			{open && (
				<div className="mt-1.5 overflow-auto rounded-lg bg-[#1a1d21] p-3.5 text-left font-mono text-[11.5px] leading-relaxed text-[#dbe4f5]">
					{message}
					{requestId && (
						<>
							<br />
							Request ID: {requestId}
						</>
					)}
				</div>
			)}
		</div>
	);
}
