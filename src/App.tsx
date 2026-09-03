import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

const CoursesListPage = lazy(() =>
	import("@/features/courses/pages/CoursesListPage").then((m) => ({ default: m.CoursesListPage })),
);
const StudentsListPage = lazy(() =>
	import("@/features/courses/pages/StudentsListPage").then((m) => ({
		default: m.StudentsListPage,
	})),
);

const CourseAttendancePage = lazy(() =>
	import("@/features/attendance/pages/CourseAttendancePage").then((m) => ({
		default: m.CourseAttendancePage,
	})),
);

const AccountSuspendedPage = lazy(() =>
	import("@/features/auth/pages/AccountSuspendedPage").then((m) => ({
		default: m.AccountSuspendedPage,
	})),
);

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
						path="/account-suspended"
						element={
							<RequireAuth checkSuspension={false}>
								<AccountSuspendedPage />
							</RequireAuth>
						}
					/>
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
								<CourseAttendancePage />
							</RequireAuth>
						}
					/>
					<Route
						path="/courses/:courseId/attendance"
						element={
							<RequireAuth>
								<CourseAttendancePage />
							</RequireAuth>
						}
					/>
					<Route
						path="/courses"
						element={
							<RequireAuth>
								<CoursesListPage />
							</RequireAuth>
						}
					/>
					<Route
						path="/courses/:courseId/students"
						element={
							<RequireAuth>
								<StudentsListPage />
							</RequireAuth>
						}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
