import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { AttendanceStatusCode } from "../types";

const STATUS_META: Record<AttendanceStatusCode, { label: string; bg: string; text: string }> = {
	P: { label: "Presente", bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]" },
	T: { label: "Tardanza", bg: "bg-[#FFF8E1]", text: "text-[#B26A00]" },
	A: { label: "Ausente", bg: "bg-[#FDECEA]", text: "text-[#C62828]" },
	E: { label: "Excusa", bg: "bg-[#E1F5FE]", text: "text-[#0288D1]" },
};

const ORDER: AttendanceStatusCode[] = ["P", "T", "A", "E"];

export function TodayStatusPicker({
	value,
	onChange,
}: {
	value: AttendanceStatusCode;
	onChange: (status: AttendanceStatusCode) => void;
}) {
	const meta = STATUS_META[value];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className={`h-7 w-8 rounded-md border-[1.3px] border-current text-xs font-extrabold ${meta.bg} ${meta.text}`}
					>
						{value}
					</button>
				}
			/>
			<DropdownMenuContent align="center" className="min-w-30 p-1">
				{ORDER.map((status) => {
					const m = STATUS_META[status];
					return (
						<DropdownMenuItem
							key={status}
							onClick={() => onChange(status)}
							className={`rounded-[5px] text-xs font-bold ${m.bg} ${m.text}`}
						>
							{status} · {m.label}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
