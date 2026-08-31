import { useState } from "react";
import { useMarkNonInstructionalDay } from "@/features/attendance/hooks";
import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

interface MarkNonInstructionalDayDialogProps {
	sectionId: string;
	schoolYearId: string;
	year: number;
	month: number;
}

export function MarkNonInstructionalDayDialog({
	sectionId,
	schoolYearId,
	year,
	month,
}: MarkNonInstructionalDayDialogProps) {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState("");
	const [reason, setReason] = useState("");

	const mutation = useMarkNonInstructionalDay(sectionId, year, month);

	function handleSubmit() {
		if (!date) return;

		mutation.mutate(
			{ schoolYearId, date, reason },
			{
				onSuccess: () => {
					setOpen(false);
					setDate("");
					setReason("");
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="outline">Marcar día no laborable</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Marcar día no laborable</DialogTitle>
					<DialogDescription>
						Registra un día en que no habrá clases por una razón fuera del calendario oficial
						(tormenta, jornada de capacitación, etc.).
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3">
					<div className="space-y-1">
						<Label htmlFor="non-instructional-date">Fecha</Label>
						<Input
							id="non-instructional-date"
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</div>

					<div className="space-y-1">
						<Label htmlFor="non-instructional-reason">Razón</Label>
						<Textarea
							id="non-instructional-reason"
							placeholder="Ej: Tormenta, jornada de capacitación..."
							value={reason}
							onChange={(e) => setReason(e.target.value)}
						/>
					</div>

					{mutation.isError && (
						<p className="text-sm text-destructive">
							{mutation.error instanceof Error ? mutation.error.message : "Ocurrió un error"}
						</p>
					)}
				</div>

				<DialogFooter>
					<Button variant="ghost" onClick={() => setOpen(false)}>
						Cancelar
					</Button>
					<Button onClick={handleSubmit} disabled={!date || mutation.isPending}>
						{mutation.isPending ? "Guardando…" : "Guardar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
