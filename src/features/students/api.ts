import { httpGet, httpPatch, httpPost } from "@/shared/lib/http";
import type { Student, StudentInput } from "./types";

export function fetchStudents(courseId: string) {
	return httpGet<Student[]>(`/courses/${courseId}/students`);
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
