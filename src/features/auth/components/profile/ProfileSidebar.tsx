type ProfileSection = "cuenta" | "docente" | "seguridad" | "zona";

const SECTIONS: { key: ProfileSection; label: string }[] = [
	{ key: "cuenta", label: "Información de cuenta" },
	{ key: "docente", label: "Configuración docente" },
	{ key: "seguridad", label: "Seguridad" },
	{ key: "zona", label: "Zona de peligro" },
];

interface ProfileSidebarProps {
	active: ProfileSection;
	onChange: (section: ProfileSection) => void;
}

export function ProfileSidebar({ active, onChange }: ProfileSidebarProps) {
	return (
		<div className="flex w-62.5 shrink-0 flex-col gap-1 border-r border-[#E0E0E0] bg-white p-7 pt-7">
			<span className="px-2.5 pb-1 text-[11px] font-bold uppercase tracking-wide text-[#a8adb5]">
				Mi perfil
			</span>
			{SECTIONS.map((section) => {
				const isActive = active === section.key;
				const isDanger = section.key === "zona";
				return (
					<button
						key={section.key}
						type="button"
						onClick={() => onChange(section.key)}
						className={`rounded-[7px] px-2.5 py-2.5 text-left text-[13px] ${isActive ? "bg-[#EEF2FB] font-bold text-[#003087]" : `font-medium ${isDanger ? "text-[#C62828]" : "text-[#5b5f66]"}`}`}
					>
						{section.label}
					</button>
				);
			})}
		</div>
	);
}

export type { ProfileSection };
