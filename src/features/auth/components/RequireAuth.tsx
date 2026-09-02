import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

export function RequireAuth({ children }: { children: ReactNode }) {
	const { data: session, isPending } = useSession();
	if (isPending) return <p className="p-8 text-muted-foreground">Cargando…</p>;
	if (!session) return <Navigate to="/login" replace />;
	return <>{children}</>;
}
