import { useQuery } from "@tanstack/react-query";
import * as api from "./api";

export function useSchoolYear(schoolYearId: string) {
	return useQuery({
		queryKey: ["schoolYear", schoolYearId],
		queryFn: () => api.fetchSchoolYear(schoolYearId),
	});
}
