import { Button } from "@/shared/ui/button";

export function CourseListEmptyState({ onCreateFirst }: { onCreateFirst: () => void }) {
	return (
		<div className="flex flex-col items-center gap-3.5 rounded-xl border border-dashed border-[#d5d8dc] bg-white py-17.5 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F5F5F5] text-2xl">
				📚
			</div>
			<span className="text-[15px] text-[#5b5f66]">Aún no tienes cursos para este año escolar</span>
			<Button className="bg-[#003087] hover:bg-[#002468]" onClick={onCreateFirst}>
				+ Crear tu primer curso
			</Button>
		</div>
	);
}
