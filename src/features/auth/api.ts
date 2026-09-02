import { httpPost } from "@/shared/lib/http";
import type { RegisterTeacherFormValues } from "./schemas/register-teacher.schema";

export function registerTeacher(input: RegisterTeacherFormValues) {
	const { confirmPassword, ...payload } = input;
	return httpPost<{ userId: string }>("/teachers/register", payload);
}
