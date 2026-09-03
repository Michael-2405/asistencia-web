import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import type { AttendanceRecordInput } from "./types";

// interface StudentRef {
// 	id: string;
// 	rollNumber: number;
// 	fullName: string;
// }

export function useMonthlyAttendance(courseId: string, year: number, month: number) {
	return useQuery({
		queryKey: ["course-attendance", courseId, year, month],
		queryFn: () => api.fetchMonthlyAttendance(courseId, year, month),
	});
}

export function useSaveDailyAttendance(courseId: string, year: number, month: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ date, records }: { date: string; records: AttendanceRecordInput[] }) =>
			api.saveDailyAttendance(courseId, date, records),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["course-attendance", courseId, year, month] }),
	});
}

export function useMarkNonInstructionalDay(courseId: string, year: number, month: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ date, reason }: { date: string; reason: string }) =>
			api.markNonInstructionalDay(courseId, date, reason),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["course-attendance", courseId, year, month] }),
	});
}
