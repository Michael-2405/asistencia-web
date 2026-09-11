import { useQuery } from "@tanstack/react-query";
import * as api from "./api";

export function useSubjects() {
	return useQuery({ queryKey: ["subjects"], queryFn: api.fetchSubjects });
}

export function useSchoolYears() {
	return useQuery({ queryKey: ["schoolYears"], queryFn: api.fetchSchoolYears });
}
