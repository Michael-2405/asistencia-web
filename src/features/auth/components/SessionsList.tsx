import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { authClient, useSession } from "../lib/auth-client";

interface SessionRow {
	id: string;
	token: string;
	userAgent?: string | null;
	ipAddress?: string | null;
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

	async function revoke(token: string) {
		await authClient.revokeSession({ token });
		setSessions((prev) => prev.filter((s) => s.token !== token));
	}

	async function revokeOthers() {
		await authClient.revokeOtherSessions();
		load();
	}

	if (loading) return <p className="mt-3 text-xs font-medium text-[#9a9a9a]">Cargando sesiones…</p>;

	return (
		<div className="mt-4">
			<div className="overflow-hidden rounded-lg border border-[#E0E0E0] bg-white">
				<table className="w-full border-collapse text-[13px]">
					<thead>
						<tr className="bg-[#F5F5F5]">
							<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">
								Dispositivo
							</th>
							<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">IP</th>
							<th className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#6b6b6b]">
								Fecha
							</th>
							<th className="px-3.5 py-2.5" />
						</tr>
					</thead>
					<tbody>
						{sessions.map((s) => {
							const isCurrent = s.token === currentSession?.session.token;
							return (
								<tr key={s.id} className="border-t border-[#F0F0F0]">
									<td className="max-w-55 truncate px-3.5 py-2.5 text-[#1a1a1a]">
										{s.userAgent ?? "Desconocido"}
										{isCurrent && (
											<span className="ml-1.5 text-[10px] font-bold text-[#2E7D32]">(actual)</span>
										)}
									</td>
									<td className="px-3.5 py-2.5 text-[#6b6b6b]">{s.ipAddress ?? "—"}</td>
									<td className="px-3.5 py-2.5 text-[#6b6b6b]">
										{new Date(s.createdAt).toLocaleString("es-DO")}
									</td>
									<td className="px-3.5 py-2.5">
										{!isCurrent && (
											<button
												type="button"
												onClick={() => revoke(s.token)}
												className="text-xs font-semibold text-[#C62828]"
											>
												Cerrar sesión
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<Button
				variant="outline"
				size="sm"
				className="mt-3 border-[1.5px] border-[#f2b3b3] text-[#C62828]"
				onClick={revokeOthers}
			>
				Cerrar todas las demás sesiones
			</Button>
		</div>
	);
}
