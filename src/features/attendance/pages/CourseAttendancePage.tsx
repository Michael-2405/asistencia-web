import { useState } from "react";
import { useParams } from "react-router-dom";
import { AttendanceGrid } from "../components/AttendanceGrid";

function generateMonthOptions(count = 6) {
	const options = [];
	const now = new Date();
	for (let i = 0; i < count; i++) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		options.push({
			year: d.getFullYear(),
			month: d.getMonth() + 1,
			label: d.toLocaleDateString("es-DO", { month: "long", year: "numeric" }),
		});
	}
	return options;
}

export function CourseAttendancePage() {
	const { courseId } = useParams<{ courseId: string }>();
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth() + 1);
	const monthOptions = generateMonthOptions();

	if (!courseId) return null;

	return (
		<AttendanceGrid
			courseId={courseId}
			year={year}
			month={month}
			monthOptions={monthOptions}
			onMonthChange={(y, m) => {
				setYear(y);
				setMonth(m);
			}}
		/>
	);
}
