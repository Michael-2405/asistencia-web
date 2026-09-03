import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useMarkNonInstructionalDay } from "../hooks";

interface Props {
	courseId: string;
	year: number;
	month: number;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export function MarkNonInstructionalDayDialog({
	courseId,
	year,
	month,
	open,
	onOpenChange,
}: Props) {
	const mutation = useMarkNonInstructionalDay(courseId, year, month);
	const [date, setDate] = useState("");
	const [reason, setReason] = useState("");

	async function submit() {
		if (!date) return;
		await mutation.mutateAsync({ date, reason });
		setDate("");
		setReason("");
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Marcar día no laborable</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
					/>
					<textarea
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Ej: Tormenta, jornada de capacitación..."
						rows={3}
						className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm outline-none focus:border-[#003087]"
					/>
					<Button
						className="w-full bg-[#003087] hover:bg-[#002468]"
						onClick={submit}
						disabled={!date || mutation.isPending}
					>
						Guardar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
