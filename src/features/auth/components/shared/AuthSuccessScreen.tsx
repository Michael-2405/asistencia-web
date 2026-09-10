import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";

interface AuthSuccessScreenProps {
	title: string;
	description: string;
	buttonLabel: string;
	onButtonClick: () => void;
	icon?: ReactNode;
}

export function AuthSuccessScreen({
	title,
	description,
	buttonLabel,
	onButtonClick,
	icon,
}: AuthSuccessScreenProps) {
	return (
		<div className="py-6 text-center">
			<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6ee] text-2xl font-bold text-[#2E7D32]">
				{icon ?? "✓"}
			</div>
			<h2 className="mt-4 text-xl font-bold text-[#1a1a1a]">{title}</h2>
			<p className="mt-2 text-sm font-medium text-[#6b6b6b]">{description}</p>
			<Button className="mt-6 w-full bg-[#003087] hover:bg-[#002468]" onClick={onButtonClick}>
				{buttonLabel}
			</Button>
		</div>
	);
}
