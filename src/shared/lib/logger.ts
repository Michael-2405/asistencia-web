type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_STYLES: Record<LogLevel, string> = {
	debug: "color: #888",
	info: "color: #2563eb",
	warn: "color: #d97706",
	error: "color: #dc2626",
};

function log(level: LogLevel, scope: string, message: string, data?: unknown): void {
	if (import.meta.env.PROD && (level === "debug" || level === "info")) return;

	const timestamp = new Date().toISOString().split("T")[1]?.replace("Z", "");
	const prefix = `%c[${timestamp}] [${scope}]`;
	const consoleMethod = {
		debug: console.debug,
		info: console.info,
		warn: console.warn,
		error: console.error,
	}[level];

	if (data === undefined) {
		consoleMethod(prefix, LEVEL_STYLES[level], message);
	} else {
		consoleMethod(prefix, LEVEL_STYLES[level], message, data);
	}
}

export function createLogger(scope: string) {
	return {
		debug: (message: string, data?: unknown) => log("debug", scope, message, data),
		info: (message: string, data?: unknown) => log("info", scope, message, data),
		warn: (message: string, data?: unknown) => log("warn", scope, message, data),
		error: (message: string, data?: unknown) => log("error", scope, message, data),
	};
}
