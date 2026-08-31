import { useQuery } from "@tanstack/react-query";
import * as api from "./api";

export function useSections(schoolYearId: string) {
	return useQuery({
		queryKey: ["sections", schoolYearId],
		queryFn: () => api.fetchSections(schoolYearId),
	});
}
