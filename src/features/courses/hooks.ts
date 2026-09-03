import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CourseInput, StudentInput } from "./api";
import * as api from "./api";

export function useSubjects() {
	return useQuery({ queryKey: ["subjects"], queryFn: api.fetchSubjects });
}

export function useSchoolYears() {
	return useQuery({ queryKey: ["schoolYears"], queryFn: api.fetchSchoolYears });
}

export function useCourses(schoolYearId?: string) {
	return useQuery({
		queryKey: ["courses", schoolYearId],
		queryFn: () => api.fetchCourses(schoolYearId),
		enabled: Boolean(schoolYearId),
	});
}

export function useCreateCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CourseInput) => api.createCourse(input),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
	});
}

export function useUpdateCourse(courseId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CourseInput) => api.updateCourse(courseId, input),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
	});
}

export function useCloneCourses() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			sourceSchoolYearId,
			courseIds,
		}: {
			sourceSchoolYearId: string;
			courseIds: string[];
		}) => api.cloneCourses(sourceSchoolYearId, courseIds),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
	});
}

export function useStudents(courseId: string) {
	return useQuery({ queryKey: ["students", courseId], queryFn: () => api.fetchStudents(courseId) });
}

export function useAddStudent(courseId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: StudentInput) => api.addStudent(courseId, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students", courseId] });
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
}

export function useUpdateStudent(courseId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ studentId, input }: { studentId: string; input: StudentInput }) =>
			api.updateStudent(courseId, studentId, input),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students", courseId] }),
	});
}

export function useWithdrawStudent(courseId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (studentId: string) => api.withdrawStudent(courseId, studentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students", courseId] });
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
}

export function useAllCourses() {
	return useQuery({ queryKey: ["courses", "all"], queryFn: () => api.fetchCourses() });
}

export function useDeleteCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (courseId: string) => api.deleteCourse(courseId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
	});
}

export function useCourse(courseId: string) {
	const { data: courses } = useAllCourses();
	return courses?.find((c) => c.id === courseId);
}
