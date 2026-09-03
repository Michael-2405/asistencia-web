import { httpGet, httpPost } from "@/shared/lib/http";
import type { RegisterTeacherFormValues } from "./schemas/register-teacher.schema";
import type { MyProfile } from "./types";

export function registerTeacher(input: RegisterTeacherFormValues) {
	const { confirmPassword, ...payload } = input;
	return httpPost<{ userId: string }>("/teachers/register", payload);
}

export function fetchMyProfile() {
	return httpGet<MyProfile>("/teachers/me");
}

export function suspendAccount(password: string) {
	return httpPost<{ scheduledDeletionAt: string }>("/teachers/me/suspend", { password });
}

export function reactivateAccount() {
	return httpPost<{ reactivated: boolean }>("/teachers/me/reactivate", {});
}
