import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/shared/lib/http";
import { Button } from "@/shared/ui/button";
import { StatusBanner } from "../components/StatusBanner";
import { useMyProfile, useReactivateAccount } from "../hooks";

export function AccountSuspendedPage() {
	const { data: profile, isLoading } = useMyProfile();
	const reactivateMutation = useReactivateAccount();
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoading && profile && !profile.suspendedAt) {
			navigate("/courses", { replace: true });
		}
	}, [isLoading, profile, navigate]);

	async function onReactivate() {
		setError(null);
		try {
			await reactivateMutation.mutateAsync();
			navigate("/courses", { replace: true });
		} catch (e) {
			setError(e instanceof ApiError ? e.message : "No se pudo reactivar la cuenta");
		}
	}

	if (isLoading || (profile && !profile.suspendedAt)) {
		return <p className="p-8 text-center text-muted-foreground">Cargando…</p>;
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#F5F5F5] p-6">
			<div className="w-full max-w-110 rounded-xl border border-[#E0E0E0] bg-white p-8 text-center">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdeeee] text-2xl">
					⏸
				</div>
				<h1 className="mt-4 text-xl font-bold text-[#1a1a1a]">Tu cuenta está suspendida</h1>
				<p className="mt-2 text-[13px] font-medium leading-relaxed text-[#6b6b6b]">
					Puedes reactivarla antes del{" "}
					{profile?.scheduledDeletionAt
						? new Date(profile.scheduledDeletionAt).toLocaleDateString("es-DO")
						: "…"}
					. Después de esa fecha, tu cuenta quedará eliminada permanentemente.
				</p>
				{error && (
					<div className="mt-4">
						<StatusBanner variant="error">{error}</StatusBanner>
					</div>
				)}
				<Button
					className="mt-6 w-full bg-[#003087] hover:bg-[#002468]"
					onClick={onReactivate}
					disabled={reactivateMutation.isPending}
				>
					{reactivateMutation.isPending ? "Reactivando…" : "Reactivar mi cuenta"}
				</Button>
			</div>
		</div>
	);
}
