import type { SchoolYearDto } from "./dto";
import type { SchoolYear } from "./types";

export function toSchoolYear(dto: SchoolYearDto): SchoolYear {
	return {
		id: dto.id,
		name: dto.nombre,
		startDate: dto.fecha_inicio,
		endDate: dto.fecha_fin,
	};
}
