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

export interface StudentInput {
	firstName: string;
	secondName?: string;
	firstLastname: string;
	secondLastname?: string;
	birthDate?: string;
	sex?: "M" | "F";
}
