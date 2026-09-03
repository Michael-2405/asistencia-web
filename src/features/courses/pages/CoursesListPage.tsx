import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { CloneCoursesDialog } from "../components/CloneCoursesDialog";
import { CourseCard } from "../components/CourseCard";
import { CourseFormSheet } from "../components/CourseFormSheet";
import { DeleteCourseDialog } from "../components/DeleteCourseDialog";
import { useCourses, useSchoolYears } from "../hooks";
import type { Course } from "../types";

export function CoursesListPage() {
	const navigate = useNavigate();
	const { data: schoolYears } = useSchoolYears();
	const [selectedYearId, setSelectedYearId] = useState<string>("");
	const { data: courses } = useCourses(selectedYearId);
	const [deletingCourse, setDeletingCourse] = useState<Course | undefined>(undefined);

	const [formOpen, setFormOpen] = useState(false);
	const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
	const [cloneOpen, setCloneOpen] = useState(false);

	useEffect(() => {
		if (schoolYears && schoolYears.length > 0 && !selectedYearId) {
			setSelectedYearId(schoolYears[0].id);
		}
	}, [schoolYears, selectedYearId]);

	function openCreate() {
		setEditingCourse(undefined);
		setFormOpen(true);
	}

	function openEdit(course: Course) {
		setEditingCourse(course);
		setFormOpen(true);
	}

	return (
		<div>
			<div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E0E0E0] bg-white px-8 py-5.5">
				<div>
					<div className="text-xl font-bold text-[#1a1a1a]">Mis Cursos</div>
					<div className="mt-2 flex items-center gap-2">
						<span className="text-[13px] font-medium text-[#6b6b6b]">Año escolar:</span>
						<select
							value={selectedYearId}
							onChange={(e) => setSelectedYearId(e.target.value)}
							className="rounded-lg border-[1.5px] border-[#E0E0E0] px-2.5 py-1.5 text-xs font-semibold text-[#1a1a1a]"
						>
							{(schoolYears ?? []).map((y) => (
								<option key={y.id} value={y.id}>
									{y.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="flex gap-2.5">
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

			<div className="px-8 py-7">
				{courses && courses.length > 0 ? (
					<div className="grid max-w-245 grid-cols-1 gap-4.5 sm:grid-cols-2">
						{courses.map((c) => (
							<CourseCard
								key={c.id}
								course={c}
								onEdit={() => openEdit(c)}
								onDelete={() => setDeletingCourse(c)}
								onViewStudents={() => navigate(`/courses/${c.id}/students`)}
								onTakeAttendance={() => navigate(`/courses/${c.id}/attendance`)}
							/>
						))}
					</div>
				) : (
					<div className="py-20 text-center">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3fb] text-2xl">
							📚
						</div>
						<div className="mt-4.5 text-[17px] font-bold text-[#1a1a1a]">
							Aún no tienes cursos para este año escolar
						</div>
						<Button className="mt-4.5 bg-[#003087] hover:bg-[#002468]" onClick={openCreate}>
							+ Crear tu primer curso
						</Button>
					</div>
				)}
			</div>

			{selectedYearId && (
				<CourseFormSheet
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
			{deletingCourse && (
				<DeleteCourseDialog
					open={Boolean(deletingCourse)}
					onOpenChange={(v) => !v && setDeletingCourse(undefined)}
					course={deletingCourse}
				/>
			)}
		</div>
	);
}
