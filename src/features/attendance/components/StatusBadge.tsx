import type { AttendanceStatusCode } from "../types";

const STYLES: Record<AttendanceStatusCode, string> = {
	P: "bg-[#e3f0e3] text-[#2E7D32] border border-[#b9dab9]",
	T: "bg-[#fdf0d3] text-[#a06a00] border border-[#f6d99a]",
	A: "bg-[#fadada] text-[#C62828] border border-[#f2b3b3]",
	E: "bg-[#d6ecfa] text-[#0277a8] border border-[#a9d8f0]",
};

export function StatusBadge({ status }: { status: AttendanceStatusCode | null }) {
	if (!status) return <span className="text-[#b0b0b0]">–</span>;
	return (
		<span
			className={`inline-flex h-6.5 w-7 items-center justify-center rounded-[5px] text-[11px] font-bold ${STYLES[status]}`}
		>
			{status}
		</span>
	);
}
