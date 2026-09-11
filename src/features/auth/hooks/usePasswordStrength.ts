export function usePasswordStrength(password: string) {
	let score = 0;
	if (password.length >= 8) score++;
	if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
	if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) score++;

	const labels = ["", "Débil", "Media", "Fuerte"];
	const colors = ["#E0E0E0", "#C62828", "#F9A825", "#2E7D32"];

	return {
		strength: score,
		label: labels[score],
		color: colors[score] || colors[0],
		hasValue: password.length > 0,
	};
}
