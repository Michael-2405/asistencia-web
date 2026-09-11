import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import type { CourseInput } from "./types";

// export function useCourse(courseId: string, schoolYearId?: string) {
// 	const { data: courses } = useCourses(schoolYearId);
// 	return courses?.find((c) => c.id === courseId);
// }

export function useCourse(courseId: string) {
	const { data: courses } = useAllCourses();
	return courses?.find((c) => c.id === courseId);
}

export function useCourses(schoolYearId?: string) {
	return useQuery({
		queryKey: ["courses", schoolYearId],
		queryFn: () => api.fetchCourses(schoolYearId),
		enabled: Boolean(schoolYearId),
	});
}

export function useAllCourses() {
	return useQuery({ queryKey: ["courses", "all"], queryFn: () => api.fetchCourses() });
}

export function useCreateCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CourseInput) => api.createCourse(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
}

export function useUpdateCourse(courseId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CourseInput) => api.updateCourse(courseId, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
}

export function useDeleteCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (courseId: string) => api.deleteCourse(courseId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
	});
}

export function useTodayAttendanceStatus() {
	return useQuery({
		queryKey: ["courses", "attendance-status"],
		queryFn: api.fetchTodayAttendanceStatus,
	});
}
