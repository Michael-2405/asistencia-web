import { httpDelete, httpGet, httpPatch, httpPost } from "@/shared/lib/http";
import type { Course, CourseInput, TodayAttendanceStatus } from "./types";

export function fetchCourses(schoolYearId?: string) {
	const query = schoolYearId ? `?schoolYearId=${schoolYearId}` : "";
	return httpGet<Course[]>(`/courses${query}`);
}

export function createCourse(input: CourseInput) {
	return httpPost<Course>("/courses", input);
}

export function updateCourse(courseId: string, input: CourseInput) {
	return httpPatch<Course>(`/courses/${courseId}`, input);
}

export function cloneCourses(sourceSchoolYearId: string, courseIds: string[]) {
	return httpPost<{ created: Course[]; createdCount: number; skippedCount: number }>(
		"/courses/clone",
		{
			sourceSchoolYearId,
			courseIds,
		},
	);
}

export function deleteCourse(courseId: string) {
	return httpDelete<Course>(`/courses/${courseId}`);
}

export function fetchTodayAttendanceStatus() {
	return httpGet<TodayAttendanceStatus[]>("/courses/attendance-status");
}
