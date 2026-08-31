const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
	throw new Error("VITE_API_URL no esta configurada. Revisa tu archivo .env");
}

export async function httpGet<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`);
	if (!res.ok) throw new Error(`GET ${path} -> HTTP ${res.status}`);
	return res.json();
}

export async function httpPost<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error(`POST ${path} -> HTTP ${res.status}`);
	return res.json();
}
