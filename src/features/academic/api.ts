import { httpGet } from "@/shared/lib/http";
import type { SchoolYear, Subject } from "./types";

export function fetchSubjects() {
	return httpGet<Subject[]>("/subjects");
}

export function fetchSchoolYears() {
	return httpGet<SchoolYear[]>("/school-years");
}
