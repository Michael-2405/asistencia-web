import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../shared/ui/select";
import type { AttendanceStatusCode } from "../types";

const STATUS_LABELS: Record<AttendanceStatusCode, string> = {
	P: "Presente",
	A: "Ausente",
	T: "Tardanza",
	E: "Excusa",
};

interface StatusSelectorProps {
	value: AttendanceStatusCode;
	onChange: (status: AttendanceStatusCode) => void;
}

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
	return (
		<Select value={value} onValueChange={(v) => onChange(v as AttendanceStatusCode)}>
			<SelectTrigger className="h-8 w-full">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{(Object.keys(STATUS_LABELS) as AttendanceStatusCode[]).map((code) => (
					<SelectItem key={code} value={code}>
						{code} — {STATUS_LABELS[code]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
