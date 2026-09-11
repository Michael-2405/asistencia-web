export function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between border-t border-[#F0F0F0] pt-2.5 first:border-t-0 first:pt-0">
			<span className="text-[#6b6b6b]">{label}</span>
			<span className="font-semibold text-[#1a1a1a]">{value}</span>
		</div>
	);
}
