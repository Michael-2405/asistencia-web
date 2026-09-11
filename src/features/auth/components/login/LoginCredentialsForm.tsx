import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "../shared/PasswordInput";

const loginSchema = z.object({
	email: z.string().email("Correo inválido"),
	password: z.string().min(1, "Requerido"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

interface LoginCredentialsFormProps {
	onSubmit: (values: LoginCredentials) => Promise<void>;
	error: string | null;
}

export function LoginCredentialsForm({ onSubmit, error }: LoginCredentialsFormProps) {
	const form = useForm<LoginCredentials>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const hasAuthError = Boolean(error);
	const fieldBorder = hasAuthError ? "border-[#C62828]" : "border-[#d5d8dc]";

	return (
		<div className="flex flex-col gap-5.5">
			<div>
				<h2 className="mb-1.5 text-2xl font-extrabold text-[#1a1d21]">Iniciar sesión</h2>
				<span className="text-[13.5px] text-[#8a8f98]">Accede con tu cuenta institucional</span>
			</div>

			{error && (
				<div className="flex items-center gap-2 rounded-lg border border-[#F3B8B4] bg-[#FDECEA] px-3.5 py-2.5 text-[13px] text-[#8f1f1f]">
					<span>⚠</span>
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-bold text-[#1a1d21]">Correo electrónico</span>
					<input
						type="email"
						{...form.register("email")}
						placeholder="nombre@escuela.edu.do"
						className={`w-full rounded-lg border-[1.5px] ${fieldBorder} px-3.5 py-2.5 text-sm outline-none focus:border-[#003087]`}
					/>
				</label>

				<label htmlFor="login-password" className="flex flex-col gap-1.5">
					<span className="text-xs font-bold text-[#1a1d21]">Contraseña</span>
					<PasswordInput
						id="login-password"
						{...form.register("password")}
						borderClassName={fieldBorder}
					/>
				</label>

				<div className="text-right">
					<Link to="/forgot-password" className="text-[12.5px] font-semibold text-[#003087]">
						¿Olvidaste tu contraseña?
					</Link>
				</div>

				<Button
					type="submit"
					disabled={form.formState.isSubmitting}
					className="w-full bg-[#003087] hover:bg-[#002468] disabled:bg-[#5a6ea8]"
				>
					{form.formState.isSubmitting && (
						<span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
					)}
					{form.formState.isSubmitting ? "Iniciando sesión…" : "Iniciar sesión"}
				</Button>
			</form>

			<div className="flex items-center gap-3">
				<div className="h-px flex-1 bg-[#E0E0E0]" />
				<span className="text-[11.5px] text-[#a8adb5]">o</span>
				<div className="h-px flex-1 bg-[#E0E0E0]" />
			</div>

			<p className="text-center text-[13.5px] text-[#5b5f66]">
				¿No tienes cuenta?{" "}
				<Link to="/register" className="font-bold text-[#003087]">
					Regístrate
				</Link>
			</p>
		</div>
	);
}
