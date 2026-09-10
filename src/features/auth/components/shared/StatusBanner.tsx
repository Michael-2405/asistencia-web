import type { ReactNode } from "react";

type BannerVariant = "error" | "success" | "warning";

const VARIANT_STYLES: Record<BannerVariant, string> = {
	error: "bg-[#fdeeee] border-[#f2b3b3] text-[#C62828]",
	success: "bg-[#eef6ee] border-[#b9dab9] text-[#1a1a1a]",
	warning: "bg-[#fff8e6] border-[#f6d99a] text-[#a06a00]",
};

export function StatusBanner({
	variant,
	children,
}: {
	variant: BannerVariant;
	children: ReactNode;
}) {
	return (
		<div className={`rounded-lg border px-3.5 py-3 text-xs font-medium ${VARIANT_STYLES[variant]}`}>
			{children}
		</div>
	);
}
