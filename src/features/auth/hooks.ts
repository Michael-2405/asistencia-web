import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";

export function useMyProfile(enabled = true) {
	return useQuery({ queryKey: ["me"], queryFn: api.fetchMyProfile, enabled });
}

export function useSuspendAccount() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (password: string) => api.suspendAccount(password),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
	});
}

export function useReactivateAccount() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => api.reactivateAccount(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
	});
}
