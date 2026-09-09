import type { ReactNode } from "react";

interface ErrorHeroProps {
	code: string;
	icon: ReactNode;
	title: string;
	description: string;
	actions: ReactNode;
	footnote?: string;
	children?: ReactNode;
}

export function ErrorHero({
	code,
	icon,
	title,
	description,
	actions,
	footnote,
	children,
}: ErrorHeroProps) {
	return (
		<div className="flex flex-1 items-center justify-center p-10">
			<div className="relative flex max-w-[440px] flex-col items-center gap-4.5 text-center">
				<span
					aria-hidden
					className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none text-[150px] font-extrabold leading-none text-[#F0F2F5]"
				>
					{code}
				</span>

				<div className="relative z-10">{icon}</div>

				<div className="relative z-10 flex flex-col gap-2.5">
					<h1 className="text-[23px] font-extrabold text-[#1a1d21]">{title}</h1>
					<p className="text-sm leading-relaxed text-[#5b5f66]">{description}</p>
				</div>

				{children}

				<div className="relative z-10 mt-1.5 flex gap-2.5">{actions}</div>

				{footnote && <span className="relative z-10 text-xs text-[#8a8f98]">{footnote}</span>}
			</div>
		</div>
	);
}
