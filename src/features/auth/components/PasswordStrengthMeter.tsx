import { usePasswordStrength } from "../hooks/usePasswordStrength";

export function PasswordStrengthMeter({ password }: { password: string }) {
	const { strength, label, color, hasValue } = usePasswordStrength(password);
	if (!hasValue) return null;

	return (
		<>
			<div className="mt-0.5 flex gap-1">
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className="h-1 flex-1 rounded-full"
						style={{ background: i < strength ? color : "#E0E0E0" }}
					/>
				))}
			</div>
			<span className="text-[11px] font-semibold" style={{ color }}>
				{label}
			</span>
		</>
	);
}
