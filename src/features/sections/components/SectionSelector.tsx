import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { Section } from "../types";

interface SectionSelectorProps {
	sections: Section[];
	sectionId: string;
	onChange: (sectionId: string) => void;
}

export function SectionSelector({ sections, sectionId, onChange }: SectionSelectorProps) {
	return (
		<Select
			value={sectionId}
			onValueChange={(value) => {
				if (value) onChange(value);
			}}
		>
			<SelectTrigger className="w-40">
				<SelectValue>
					{(value: string) => {
						const section = sections.find((s) => s.id === value);
						return section ? `${section.grade} ${section.name}` : "Selecciona un curso";
					}}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{sections.map((section) => (
					<SelectItem key={section.id} value={section.id}>
						{section.grade} {section.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
