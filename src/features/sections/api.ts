import { httpGet } from "@/shared/lib/http";
import { createLogger } from "@/shared/lib/logger";
import type { SectionDto } from "./dto";
import { toSection } from "./mappers";

const logger = createLogger("SectionsApi");

export async function fetchSections(schoolYearId: string) {
	logger.debug("Fetching sections", { schoolYearId });
	const dtos = await httpGet<SectionDto[]>(`/anios-escolares/${schoolYearId}/secciones`);
	return dtos.map(toSection);
}
