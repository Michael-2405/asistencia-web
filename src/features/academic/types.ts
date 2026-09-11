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
