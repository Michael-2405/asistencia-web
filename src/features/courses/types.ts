export interface Subject {
	id: string;
	name: string;
	code: string;
	level: "PRIMARY" | "SECONDARY" | "BOTH";
	isCore: boolean;
	active: boolean;
}

export interface SchoolYear {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
}

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

export interface Student {
	id: string;
	courseId: string;
	orderNumber: number;
	firstName: string;
	secondName: string | null;
	firstLastname: string;
	secondLastname: string | null;
	birthDate: string | null;
	sex: "M" | "F" | null;
	active: boolean;
	withdrawalDate: string | null;
}
