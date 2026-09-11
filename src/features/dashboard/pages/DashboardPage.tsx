import { useMyProfile } from "@/features/auth/hooks/useProfile";
import { useAllCourses, useTodayAttendanceStatus } from "@/features/courses/hooks";
import { CourseSummaryCard } from "../components/CourseSummaryCard";
import { PendingAttendanceBanner } from "../components/PendingAttendanceBanner";

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Buenos días";
	if (hour < 19) return "Buenas tardes";
	return "Buenas noches";
}

export function DashboardPage() {
	const { data: profile } = useMyProfile();
	const { data: courses } = useAllCourses();
	const { data: attendanceStatus } = useTodayAttendanceStatus();

	const firstName = profile?.name.split(" ")[0] ?? "";
	const today = new Date().toLocaleDateString("es-DO", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const statusByCourseId = new Map((attendanceStatus ?? []).map((s) => [s.courseId, s.submitted]));
	const pendingCount = (courses ?? []).filter((c) => statusByCourseId.get(c.id) === false).length;
	const totalStudents = (courses ?? []).reduce((sum, c) => sum + c.activeStudentCount, 0);

	return (
		<div className="mx-auto flex max-w-295 flex-col gap-5.5 p-8">
			<div>
				<h1 className="mb-1 text-2xl font-extrabold capitalize text-[#1a1d21]">
					{getGreeting()}, {firstName}
				</h1>
				<span className="text-[13.5px] capitalize text-[#8a8f98]">{today}</span>
			</div>

			<PendingAttendanceBanner pendingCount={pendingCount} />

			<div>
				<h2 className="mb-3.5 text-[15px] font-extrabold uppercase tracking-wide text-[#1a1d21]">
					Mis cursos
				</h2>
				{courses && courses.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{courses.map((course) => (
							<CourseSummaryCard
								key={course.id}
								course={course}
								attendanceSubmitted={statusByCourseId.get(course.id) ?? null}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-[#8a8f98]">Aún no tienes cursos registrados.</p>
				)}
			</div>

			<div>
				<h2 className="mb-3.5 text-[15px] font-extrabold uppercase tracking-wide text-[#1a1d21]">
					Resumen rápido
				</h2>
				<div className="w-fit rounded-[11px] border border-[#E0E0E0] bg-white px-5.5 py-4.5">
					<span className="text-xs font-semibold uppercase tracking-wide text-[#8a8f98]">
						Estudiantes a cargo
					</span>
					<div className="mt-1 text-[28px] font-extrabold text-[#003087]">{totalStudents}</div>
				</div>
			</div>
		</div>
	);
}
