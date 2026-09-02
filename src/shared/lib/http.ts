const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
	throw new Error("VITE_API_URL no está configurada. Revisa tu archivo .env.");
}

export interface ApiErrorDetail {
	field: string;
	message: string;
}

export class ApiError extends Error {
	readonly code: string;
	readonly details?: ApiErrorDetail[];

	constructor(code: string, message: string, details?: ApiErrorDetail[]) {
		super(message);
		this.name = "ApiError";
		this.code = code;
		this.details = details;
	}
}

async function parseResponse<T>(res: Response): Promise<T> {
	const body = await res.json();

	if (!res.ok || body.status === "error") {
		throw new ApiError(
			body.error?.code ?? "UNKNOWN_ERROR",
			body.error?.message ?? "Error desconocido",
			body.error?.details,
		);
	}

	return body.data as T;
}

export async function httpGet<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, { credentials: "include" });
	return parseResponse<T>(res);
}

export async function httpPost<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(body),
	});
	return parseResponse<T>(res);
}
