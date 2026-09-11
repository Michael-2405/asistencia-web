interface PasswordRequirement {
	text: string;
	test: (password: string) => boolean;
}

const DEFAULT_REQUIREMENTS: PasswordRequirement[] = [
	{ text: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
	{ text: "Una mayúscula", test: (p) => /[A-Z]/.test(p) },
	{ text: "Un número", test: (p) => /[0-9]/.test(p) },
];

interface PasswordRequirementsListProps {
	password: string;
	requirements?: PasswordRequirement[];
}

export function PasswordRequirementsList({
	password,
	requirements = DEFAULT_REQUIREMENTS,
}: PasswordRequirementsListProps) {
	return (
		<div className="mt-2.5 flex flex-col gap-1">
			{requirements.map((r) => {
				const ok = r.test(password);
				return (
					<div
						key={r.text}
						className="flex items-center gap-1.5 text-xs font-medium"
						style={{ color: ok ? "#2E7D32" : "#9a9a9a" }}
					>
						<span>{ok ? "✓" : "○"}</span>
						<span>{r.text}</span>
					</div>
				);
			})}
		</div>
	);
}

export function allRequirementsMet(
	password: string,
	requirements: PasswordRequirement[] = DEFAULT_REQUIREMENTS,
): boolean {
	return requirements.every((r) => r.test(password));
}
