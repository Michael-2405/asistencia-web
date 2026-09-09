import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { authClient, useSession } from "../lib/auth-client";

interface SessionRow {
	id: string;
	token: string;
	userAgent?: string | null;
	createdAt: string;
}

export function SessionsList() {
	const { data: currentSession } = useSession();
	const [sessions, setSessions] = useState<SessionRow[]>([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(async () => {
		const { data } = await authClient.listSessions();
		if (data) setSessions(data as unknown as SessionRow[]);
		setLoading(false);
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	async function revokeOthers() {
		await authClient.revokeOtherSessions();
		load();
	}

	if (loading) return <p className="text-xs font-medium text-[#8a8f98]">Cargando sesiones…</p>;

	return (
		<div>
			<div className="text-[13.5px] font-bold text-[#1a1d21]">Últimos accesos</div>
			<table className="mt-2.5 w-full border-collapse text-[12.5px]">
				<thead>
					<tr className="text-left font-bold text-[#8a8f98]">
						<th className="border-b border-[#F0F0F0] py-1.5">Fecha</th>
						<th className="border-b border-[#F0F0F0] py-1.5">Hora</th>
						<th className="border-b border-[#F0F0F0] py-1.5">Dispositivo</th>
					</tr>
				</thead>
				<tbody>
					{sessions.map((s) => {
						const date = new Date(s.createdAt);
						const isCurrent = s.token === currentSession?.session.token;
						return (
							<tr key={s.id}>
								<td className="border-b border-[#F5F5F5] py-2 text-[#1a1d21]">
									{date.toLocaleDateString("es-DO")}
								</td>
								<td className="border-b border-[#F5F5F5] py-2 text-[#1a1d21]">
									{date.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })}
								</td>
								<td className="max-w-55 truncate border-b border-[#F5F5F5] py-2 text-[#5b5f66]">
									{s.userAgent ?? "Desconocido"}
									{isCurrent && (
										<span className="ml-1.5 text-[10px] font-bold text-[#2E7D32]">(actual)</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<Button
				variant="outline"
				size="sm"
				className="mt-3.5 self-start border-[1.5px] border-[#d5d8dc] text-[#5b5f66]"
				onClick={revokeOthers}
			>
				Cerrar todas las demás sesiones activas
			</Button>
		</div>
	);
}
