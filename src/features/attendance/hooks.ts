import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { createLogger } from "../../shared/lib/logger";
import * as api from "./api";
import type { AttendanceRecordInput, AttendanceStatusCode } from "./types";

const logger = createLogger("AttendanceHooks");

export function useMonthlyAttendance(sectionId: string, year: number, month: number) {
	return useQuery({
		queryKey: ["attendance", "monthly", sectionId, year, month],
		queryFn: () => api.fetchMonthlyAttendance(sectionId, year, month),
	});
}

export function useDailyAttendance(sectionId: string, date: string) {
	return useQuery({
		queryKey: ["attendance", "daily", sectionId, date],
		queryFn: () => api.fetchDailyAttendance(sectionId, date),
	});
}

export function useSaveDailyAttendance(sectionId: string, year: number, month: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { date: string; records: AttendanceRecordInput[] }) =>
			api.saveDailyAttendance(sectionId, params.date, params.records),
		onSuccess: (_result, params) => {
			logger.info("Daily attendance saved, invalidating cache", { date: params.date });
			queryClient.invalidateQueries({
				queryKey: ["attendance", "monthly", sectionId, year, month],
			});
			queryClient.invalidateQueries({ queryKey: ["attendance", "daily", sectionId, params.date] });
		},
		onError: (error, params) => {
			logger.error("Failed to save daily attendance", { date: params.date, error });
		},
	});
}

export function useTodayEdits(
	rows: { enrollmentId: string; statusByDate: Record<string, string> }[],
	todayIso: string,
) {
	const [edits, setEdits] = useState<Record<string, AttendanceStatusCode>>(() => {
		const initial: Record<string, AttendanceStatusCode> = {};
		for (const row of rows) {
			initial[row.enrollmentId] = (row.statusByDate[todayIso] as AttendanceStatusCode) ?? "P";
		}
		return initial;
	});

	const setStatus = useCallback((enrollmentId: string, status: AttendanceStatusCode) => {
		setEdits((prev) => ({ ...prev, [enrollmentId]: status }));
	}, []);

	return { edits, setStatus };
}

export function useMarkNonInstructionalDay(sectionId: string, year: number, month: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { schoolYearId: string; date: string; reason: string }) =>
			api.markNonInstructionalDay(params.schoolYearId, params.date, params.reason),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["attendance", "monthly", sectionId, year, month],
			});
		},
		onError: (error, params) => {
			logger.error("Failed to mark non-instructional day", { date: params.date, error });
		},
	});
}
