import type { SectionDto } from "./dto";
import type { Section } from "./types";

export function toSection(dto: SectionDto): Section {
	return { id: dto.id, grade: dto.grado, name: dto.nombre };
}
