import type { AttendanceStatusCode } from "../types";

const STATUS_STYLES: Record<AttendanceStatusCode, string> = {
	P: "bg-green-100 text-green-700",
	A: "bg-red-100 text-red-700",
	T: "bg-amber-100 text-amber-700",
	E: "bg-blue-100 text-blue-700",
};

interface StatusBadgeProps {
	status: AttendanceStatusCode | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
	if (!status) return <span className="text-muted-foreground">-</span>;

	return (
		<span
			className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-medium ${STATUS_STYLES[status]}`}
		>
			{status}
		</span>
	);
}
