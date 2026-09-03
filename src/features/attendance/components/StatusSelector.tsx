import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { AttendanceStatusCode } from "../types";

const LABELS: Record<AttendanceStatusCode, string> = {
	P: "Presente",
	T: "Tardanza",
	A: "Ausente",
	E: "Excusa",
};

export function StatusSelector({
	value,
	onChange,
}: {
	value: AttendanceStatusCode;
	onChange: (s: AttendanceStatusCode) => void;
}) {
	return (
		<Select value={value} onValueChange={(v) => onChange(v as AttendanceStatusCode)}>
			<SelectTrigger className="h-7 w-full text-xs">
				<SelectValue>{(v: string) => v}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{(Object.keys(LABELS) as AttendanceStatusCode[]).map((code) => (
					<SelectItem key={code} value={code}>
						{code} — {LABELS[code]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
