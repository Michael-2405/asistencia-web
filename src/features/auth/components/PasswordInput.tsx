import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { FIELD_CLASS } from "../constants";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	function PasswordInput({ className, ...props }, ref) {
		const [visible, setVisible] = useState(false);

		return (
			<div className="relative">
				<input
					ref={ref}
					type={visible ? "text" : "password"}
					className={`${FIELD_CLASS} pr-11 ${className ?? ""}`}
					{...props}
				/>
				<button
					type="button"
					onClick={() => setVisible((v) => !v)}
					className="absolute inset-y-1 right-1 w-9 text-[11px] font-medium text-[#6b6b6b]"
				>
					{visible ? "Ocultar" : "Mostrar"}
				</button>
			</div>
		);
	},
);
