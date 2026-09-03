import { httpDelete, httpGet, httpPatch, httpPost } from "@/shared/lib/http";
import type { Course, SchoolYear, Student, Subject } from "./types";

export function fetchSubjects() {
	return httpGet<Subject[]>("/subjects");
}

export function fetchSchoolYears() {
	return httpGet<SchoolYear[]>("/school-years");
}

export function fetchCourses(schoolYearId?: string) {
	const query = schoolYearId ? `?schoolYearId=${schoolYearId}` : "";
	return httpGet<Course[]>(`/courses${query}`);
}

export interface CourseInput {
	grade: string;
	section: string;
	educationLevel: "PRIMARY" | "SECONDARY";
	isHomeroom: boolean;
	subjectId?: string;
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

export function fetchStudents(courseId: string) {
	return httpGet<Student[]>(`/courses/${courseId}/students`);
}

export interface StudentInput {
	firstName: string;
	secondName?: string;
	firstLastname: string;
	secondLastname?: string;
	birthDate?: string;
	sex?: "M" | "F";
}

export function addStudent(courseId: string, input: StudentInput) {
	return httpPost<Student>(`/courses/${courseId}/students`, input);
}

export function updateStudent(courseId: string, studentId: string, input: StudentInput) {
	return httpPatch<Student>(`/courses/${courseId}/students/${studentId}`, input);
}

export function withdrawStudent(courseId: string, studentId: string) {
	return httpPatch<Student>(`/courses/${courseId}/students/${studentId}/withdraw`, {});
}

export function deleteCourse(courseId: string) {
	return httpDelete<Course>(`/courses/${courseId}`);
}
