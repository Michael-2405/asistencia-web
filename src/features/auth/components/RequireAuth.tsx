import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useMyProfile } from "../hooks";
import { useSession } from "../lib/auth-client";

interface RequireAuthProps {
	children: ReactNode;
	checkSuspension?: boolean;
}

export function RequireAuth({ children, checkSuspension = true }: RequireAuthProps) {
	const { data: session, isPending } = useSession();
	const { data: profile, isLoading: profileLoading } = useMyProfile(
		Boolean(session) && checkSuspension,
	);

	if (isPending) return <p className="p-8 text-muted-foreground">Cargando…</p>;
	if (!session) return <Navigate to="/login" replace />;

	if (checkSuspension) {
		if (profileLoading) return <p className="p-8 text-muted-foreground">Cargando…</p>;
		if (profile?.suspendedAt) return <Navigate to="/account-suspended" replace />;
	}

	return <>{children}</>;
}
