export function usePasswordStrength(password: string) {
	const length = password.length;
	let strength = 0;
	if (length >= 8) strength++;
	if (/[A-Z]/.test(password)) strength++;
	if (/[0-9]/.test(password) && /[a-z]/.test(password)) strength++;

	const label = length === 0 ? "" : strength <= 1 ? "Débil" : strength === 2 ? "Media" : "Fuerte";
	const color = strength <= 1 ? "#C62828" : strength === 2 ? "#E65100" : "#2E7D32";

	return { strength, label, color, hasValue: length > 0 };
}
