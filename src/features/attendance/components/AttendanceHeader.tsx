interface AttendanceHeaderProps {
	sectionLabel: string;
	monthLabel: string;
	instructionalDaysCount: number;
}

export function AttendanceHeader({
	sectionLabel,
	monthLabel,
	instructionalDaysCount,
}: AttendanceHeaderProps) {
	return (
		<div className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
			<span>
				Profesor: <span className="font-medium text-foreground">[Nombre del profesor]</span>
			</span>
			<span>
				Curso: <span className="font-medium text-foreground">{sectionLabel}</span>
			</span>
			<span>
				Mes: <span className="font-medium text-foreground">{monthLabel}</span>
			</span>
			<span>
				Días trabajados:{" "}
				<span className="font-medium text-foreground">{instructionalDaysCount}</span>
			</span>
		</div>
	);
}
