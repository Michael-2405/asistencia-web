import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown(durationSeconds: number) {
	const [seconds, setSeconds] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

	const start = useCallback(() => {
		clearInterval(intervalRef.current);
		setSeconds(durationSeconds);
		intervalRef.current = setInterval(() => {
			setSeconds((s) => {
				if (s <= 1) {
					clearInterval(intervalRef.current);
					return 0;
				}
				return s - 1;
			});
		}, 1000);
	}, [durationSeconds]);

	useEffect(() => () => clearInterval(intervalRef.current), []);

	return { seconds, isActive: seconds > 0, start };
}
