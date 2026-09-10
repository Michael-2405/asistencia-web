import type { ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	wide?: boolean;
}

export function AuthLayout({
	children,
	title = "Cuaderno Digital",
	subtitle = "Gestiona la asistencia y las calificaciones de tus estudiantes.",
	wide = false,
}: AuthLayoutProps) {
	return (
		<div
			className={`grid min-h-screen grid-cols-1 bg-white ${wide ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-2"}`}
		>
			<div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-b from-[#003087] to-[#00143c] p-11 lg:flex">
				<div className="relative z-10 flex items-center gap-3">
					<div className="flex h-9.5 w-9.5 items-center justify-center rounded-[9px] bg-white text-[17px] font-extrabold text-[#003087]">
						CD
					</div>
					<span className="text-[17px] font-extrabold text-white">Cuaderno Digital</span>
				</div>
				<div className="relative z-10 max-w-105 text-white">
					<h1 className="mb-3.5 text-[30px] font-extrabold leading-tight lg:text-[34px]">
						{title}
					</h1>
					<p className="text-[15px] leading-relaxed text-[#dbe4f5] lg:text-base">{subtitle}</p>
				</div>
				<div className="relative z-10 text-xs text-[#9fb2da]">© 2026 Cuaderno Digital</div>
			</div>

			<div className="flex items-center justify-center p-10">
				<div className={`w-full ${wide ? "max-w-310" : "max-w-95"}`}>{children}</div>
			</div>
		</div>
	);
}
