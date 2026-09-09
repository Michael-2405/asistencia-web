import { Component, type ErrorInfo, type ReactNode } from "react";
import { createLogger } from "../lib/logger";

const logger = createLogger("ErrorBoundary");

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}
interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		logger.error("Error no capturado en el árbol de componentes", {
			error: error.message,
			stack: error.stack,
			componentStack: info.componentStack,
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6 text-center">
						<h2 className="text-lg font-bold text-[#1a1a1a]">Algo salió mal</h2>
						<p className="text-sm text-[#6b6b6b]">Intenta recargar la página.</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="rounded-lg bg-[#003087] px-4 py-2 text-sm text-white"
						>
							Recargar
						</button>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
