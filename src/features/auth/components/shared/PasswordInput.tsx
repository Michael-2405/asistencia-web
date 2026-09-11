import { forwardRef, type InputHTMLAttributes, useState } from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
	borderClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	function PasswordInput({ className, borderClassName = "border-[#d5d8dc]", ...props }, ref) {
		const [visible, setVisible] = useState(false);

		return (
			<div className="relative">
				<input
					ref={ref}
					type={visible ? "text" : "password"}
					className={`w-full rounded-lg border-[1.5px] ${borderClassName} px-3.5 py-2.5 pr-12 text-sm outline-none focus:border-[#003087] ${className ?? ""}`}
					{...props}
				/>
				<button
					type="button"
					onClick={() => setVisible((v) => !v)}
					className="absolute inset-y-0 right-1 px-2.5 text-[12.5px] font-semibold text-[#8a8f98]"
				>
					{visible ? "Ocultar" : "Mostrar"}
				</button>
			</div>
		);
	},
);
