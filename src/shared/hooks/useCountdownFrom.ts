import { useEffect, useState } from "react";

export function useCountdownFrom(initialSeconds: number) {
	const [seconds, setSeconds] = useState(initialSeconds);

	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((s) => Math.max(0, s - 1));
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

	return { seconds, formatted };
}
