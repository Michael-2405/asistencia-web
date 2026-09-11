import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { useSchoolYears } from "../../academic/hooks";
import { CloneCoursesDialog } from "../components/CloneCoursesDialog";
import { CourseFormDialog } from "../components/CourseFormDialog";
import { CourseCard } from "../components/course-list/CourseCard";
import { CourseListEmptyState } from "../components/course-list/CourseListEmptyState";
import { DeleteCourseDialog } from "../components/DeleteCourseDialog";
import { useCourses, useTodayAttendanceStatus } from "../hooks";
import type { Course } from "../types";

export function CoursesListPage() {
	const { data: schoolYears } = useSchoolYears();
	const [selectedYearId, setSelectedYearId] = useState<string>("");
	const { data: courses } = useCourses(selectedYearId);
	const { data: attendanceStatus } = useTodayAttendanceStatus();

	const [formOpen, setFormOpen] = useState(false);
	const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
	const [cloneOpen, setCloneOpen] = useState(false);
	const [deactivatingCourse, setDeactivatingCourse] = useState<Course | undefined>(undefined);

	useEffect(() => {
		if (schoolYears && schoolYears.length > 0 && !selectedYearId) {
			setSelectedYearId(schoolYears[0].id);
		}
	}, [schoolYears, selectedYearId]);

	const statusByCourseId = new Map((attendanceStatus ?? []).map((s) => [s.courseId, s.submitted]));

	function openCreate() {
		setEditingCourse(undefined);
		setFormOpen(true);
	}

	function openEdit(course: Course) {
		setEditingCourse(course);
		setFormOpen(true);
	}

	return (
		<div className="mx-auto flex max-w-295 flex-col gap-5.5 p-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="mb-1 text-2xl font-extrabold text-[#1a1d21]">Mis Cursos</h1>
					<select
						value={selectedYearId}
						onChange={(e) => setSelectedYearId(e.target.value)}
						className="rounded-[7px] border border-[#d5d8dc] bg-white px-2.5 py-1.5 text-[13px] font-semibold text-[#5b5f66]"
					>
						{(schoolYears ?? []).map((y) => (
							<option key={y.id} value={y.id}>
								Año Escolar {y.name}
							</option>
						))}
					</select>
				</div>
				<div className="flex flex-wrap gap-2.5">
					<Button
						variant="outline"
						className="border-[1.5px] border-[#003087] text-[#003087]"
						onClick={() => setCloneOpen(true)}
					>
						Clonar cursos del año anterior
					</Button>
					<Button className="bg-[#003087] hover:bg-[#002468]" onClick={openCreate}>
						+ Nuevo Curso
					</Button>
				</div>
			</div>

			{courses && courses.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{courses.map((c) => (
						<CourseCard
							key={c.id}
							course={c}
							attendanceSubmitted={statusByCourseId.get(c.id) ?? null}
							onEdit={() => openEdit(c)}
							onDeactivate={() => setDeactivatingCourse(c)}
						/>
					))}
				</div>
			) : (
				<CourseListEmptyState onCreateFirst={openCreate} />
			)}

			{selectedYearId && (
				<CourseFormDialog
					open={formOpen}
					onOpenChange={setFormOpen}
					schoolYearId={selectedYearId}
					course={editingCourse}
				/>
			)}
			{selectedYearId && (
				<CloneCoursesDialog
					open={cloneOpen}
					onOpenChange={setCloneOpen}
					currentSchoolYearId={selectedYearId}
				/>
			)}
			{deactivatingCourse && (
				<DeleteCourseDialog
					open={Boolean(deactivatingCourse)}
					onOpenChange={(v) => !v && setDeactivatingCourse(undefined)}
					course={deactivatingCourse}
				/>
			)}
		</div>
	);
}
