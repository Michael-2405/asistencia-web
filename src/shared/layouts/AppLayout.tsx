import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMyProfile } from "@/features/auth/hooks/useProfile";
import { authClient } from "@/features/auth/lib/auth-client";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("AppLayout");

const NAV_ITEMS = [
	{ to: "/courses", label: "Mis Cursos", icon: LayoutDashboard },
	{ to: "/profile", label: "Mi Perfil", icon: User },
];

export function AppLayout() {
	const navigate = useNavigate();
	const { data: profile } = useMyProfile();

	async function handleSignOut() {
		logger.info("Cerrando sesion");
		await authClient.signOut();
		navigate("/login");
	}

	return (
		<div className="min-h-screen bg-[#F5F5F5]">
			<header className="flex items-center justify-between border-b border-[#E0E0E0] bg-white px-6 py-3">
				<div className="flex items-center gap-8">
					<span className="text-lg font-bold text-[#003087]">Cuaderno Digital</span>

					<nav className="flex gap-1">
						{NAV_ITEMS.map((item) => (
							<a
								key={item.to}
								href={item.to}
								onClick={(e) => {
									e.preventDefault();
									navigate(item.to);
								}}
								className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#F5F5F5]"
							>
								<item.icon className="size-4" />
								{item.label}
							</a>
						))}
					</nav>
				</div>

				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-[#6b6b6b]">{profile?.name}</span>

					<button
						type="button"
						onClick={handleSignOut}
						className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#C62828] hover:bg-[#fdeeee]"
					>
						<LogOut className="size-4" />
						Salir
					</button>
				</div>
			</header>

			<main>
				<ErrorBoundary>
					<Outlet />
				</ErrorBoundary>
			</main>
		</div>
	);
}
