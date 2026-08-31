import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { MonthOption } from "../types";

interface MonthSelectorProps {
	options: MonthOption[];
	year: number;
	month: number;
	onChange: (year: number, month: number) => void;
}

export function MonthSelector({ options, year, month, onChange }: MonthSelectorProps) {
	const value = `${year}-${month}`;

	return (
		<Select
			value={value}
			onValueChange={(v) => {
				if (!v) return;
				const [newYear, newMonth] = v.split("-").map(Number);
				onChange(newYear, newMonth);
			}}
		>
			<SelectTrigger className="w-48">
				<SelectValue>
					{(v: string) => {
						const option = options.find((o) => `${o.year}-${o.month}` === v);
						return option?.label ?? "Selecciona un mes";
					}}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem
						key={`${option.year}-${option.month}`}
						value={`${option.year}-${option.month}`}
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
