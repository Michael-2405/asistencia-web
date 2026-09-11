import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import type { StudentInput } from "./types";

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
