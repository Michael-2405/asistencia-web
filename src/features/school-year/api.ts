import { httpGet } from "@/shared/lib/http";
import { createLogger } from "@/shared/lib/logger";
import type { SchoolYearDto } from "./dto";
import { toSchoolYear } from "./mappers";

const logger = createLogger("SchoolYearApi");

export async function fetchSchoolYear(schoolYearId: string) {
	logger.debug("Fetching school year", { schoolYearId });
	const dto = await httpGet<SchoolYearDto>(`/anios-escolares/${schoolYearId}`);
	return toSchoolYear(dto);
}
