export interface MyProfile {
	name: string;
	email: string;
	emailVerified: boolean;
	twoFactorEnabled: boolean;
	educationLevel: "PRIMARY" | "SECONDARY";
	isHomeroomTeacher: boolean;
	subjectName: string | null;
	suspendedAt: string | null;
	scheduledDeletionAt: string | null;
}
