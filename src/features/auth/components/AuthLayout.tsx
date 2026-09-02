import type { ReactNode } from "react";

interface AuthLayoutProps {
	tagline: string;
	footerNote: string;
	children: ReactNode;
}

export function AuthLayout({ tagline, footerNote, children }: AuthLayoutProps) {
	return (
		<div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
			<div className="hidden flex-col justify-between bg-linear-to-br from-[#001d5c] via-[#003087] to-[#0a3fa8] p-14 text-white lg:flex">
				<div>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[15px] font-extrabold text-[#003087]">
							RD
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/10 text-[15px] font-extrabold">
							MINERD
						</div>
					</div>
					<p className="mt-10 text-xs font-semibold uppercase tracking-wide text-[#9db3dd]">
						Ministerio de Educación · República Dominicana
					</p>
					<h1 className="mt-2 text-3xl font-extrabold leading-tight">Registro de Grado Digital</h1>
					<p className="mt-2 max-w-sm text-[15px] font-medium text-[#c3d2f0]">{tagline}</p>
				</div>
				<div className="border-t border-white/20 pt-5 text-xs font-medium text-[#9db3dd]">
					{footerNote}
				</div>
			</div>

			<div className="flex items-center justify-center p-10">
				<div className="w-full max-w-105">{children}</div>
			</div>
		</div>
	);
}
