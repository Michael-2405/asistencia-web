// import { useEffect, useState } from "react";
// import { AttendanceGrid } from "@/features/attendance/components/AttendanceGrid";
// import { MonthSelector } from "@/features/school-year/components/MonthSelector";
// import { useSchoolYear } from "@/features/school-year/hooks";
// import { generateMonthOptions } from "@/features/school-year/utils";
// import { SectionSelector } from "@/features/sections/components/SectionSelector";
// import { useSections } from "@/features/sections/hooks";

// const SCHOOL_YEAR_ID = "dbac1365-bbc4-4335-978a-38cddf111780";

// function App() {
// 	const { data: schoolYear } = useSchoolYear(SCHOOL_YEAR_ID);
// 	const { data: sections } = useSections(SCHOOL_YEAR_ID);

// 	const [sectionId, setSectionId] = useState<string | null>(null);
// 	const [selectedYear, setSelectedYear] = useState<number | null>(null);
// 	const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

// 	useEffect(() => {
// 		if (sections && sections.length > 0 && !sectionId) {
// 			setSectionId(sections[0].id);
// 		}
// 	}, [sections, sectionId]);

// 	useEffect(() => {
// 		if (schoolYear && selectedYear === null) {
// 			const today = new Date();
// 			const todayYear = today.getFullYear();
// 			const todayMonth = today.getMonth() + 1;
// 			const options = generateMonthOptions(schoolYear.startDate, schoolYear.endDate);
// 			const isTodayInRange = options.some((o) => o.year === todayYear && o.month === todayMonth);

// 			if (isTodayInRange) {
// 				setSelectedYear(todayYear);
// 				setSelectedMonth(todayMonth);
// 			} else {
// 				setSelectedYear(options[0].year);
// 				setSelectedMonth(options[0].month);
// 			}
// 		}
// 	}, [schoolYear, selectedYear]);

// 	if (
// 		!schoolYear ||
// 		!sections ||
// 		sectionId === null ||
// 		selectedYear === null ||
// 		selectedMonth === null
// 	) {
// 		return <p className="p-6 text-muted-foreground">Cargando…</p>;
// 	}

// 	const monthOptions = generateMonthOptions(schoolYear.startDate, schoolYear.endDate);

// 	return (
// 		<main className="mx-auto max-w-[1600px] p-6">
// 			<h1 className="mb-4 text-xl font-semibold">Control de asistencia y puntualidad</h1>

// 			<div className="mb-4 flex gap-3">
// 				<SectionSelector sections={sections} sectionId={sectionId} onChange={setSectionId} />
// 				<MonthSelector
// 					options={monthOptions}
// 					year={selectedYear}
// 					month={selectedMonth}
// 					onChange={(year, month) => {
// 						setSelectedYear(year);
// 						setSelectedMonth(month);
// 					}}
// 				/>
// 			</div>

// 			<AttendanceGrid
// 				sectionId={sectionId}
// 				schoolYearId={SCHOOL_YEAR_ID}
// 				year={selectedYear}
// 				month={selectedMonth}
// 			/>
// 		</main>
// 	);
// }

// export default App;

import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AttendanceGrid } from "@/features/attendance/components/AttendanceGrid";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

const LoginPage = lazy(() =>
	import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
	import("@/features/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
	import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({
		default: m.ForgotPasswordPage,
	})),
);
const ResetPasswordPage = lazy(() =>
	import("@/features/auth/pages/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })),
);
const ProfilePage = lazy(() =>
	import("@/features/auth/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const VerifyEmailNotice = lazy(() =>
	import("@/features/auth/components/VerifyEmailNotice").then((m) => ({
		default: m.VerifyEmailNotice,
	})),
);

function App() {
	return (
		<BrowserRouter>
			<Suspense fallback={<p className="p-8 text-muted-foreground">Cargando…</p>}>
				<Routes>
					<Route path="/" element={<Navigate to="/login" replace />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/verify-email" element={<VerifyEmailNotice />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route
						path="/profile"
						element={
							<RequireAuth>
								<ProfilePage />
							</RequireAuth>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<RequireAuth>
								<main className="mx-auto max-w-[1600px] p-6">
									<AttendanceGrid sectionId="..." schoolYearId="..." year={2026} month={8} />
								</main>
							</RequireAuth>
						}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
