export interface Course {
	id: string;
	schoolYearId: string;
	grade: string;
	section: string;
	educationLevel: "PRIMARY" | "SECONDARY";
	isHomeroom: boolean;
	subjectId: string | null;
	subjectName: string | null;
	active: boolean;
	activeStudentCount: number;
	inactiveStudentCount: number;
}
export interface CourseInput {
	grade: string;
	section: string;
	educationLevel: "PRIMARY" | "SECONDARY";
	isHomeroom: boolean;
	subjectId?: string;
}

export interface TodayAttendanceStatus {
	courseId: string;
	submitted: boolean;
}
