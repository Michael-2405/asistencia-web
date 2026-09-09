import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { FIELD_CLASS } from "../constants";
import { PasswordInput } from "./PasswordInput";
import { StatusBanner } from "./StatusBanner";

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

	return (
		<div>
			<h2 className="text-2xl font-bold text-[#1a1a1a]">Iniciar sesión</h2>
			<p className="mt-1.5 text-[13px] font-medium text-[#6b6b6b]">Ingresa con tu correo</p>

			{error && (
				<div className="mt-5">
					<StatusBanner variant="error">{error}</StatusBanner>
				</div>
			)}

			<form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
				<label className="flex flex-col gap-1.5">
					<span className="text-xs font-semibold text-[#333]">Correo electrónico</span>
					<input
						type="email"
						{...form.register("email")}
						placeholder="nombre.apellido@correo.com"
						className={FIELD_CLASS}
					/>
				</label>

				<label htmlFor="login-password" className="flex flex-col gap-1.5">
					<span className="text-xs font-semibold text-[#333]">Contraseña</span>
					<PasswordInput id="login-password" {...form.register("password")} />
				</label>

				<div className="text-right">
					<Link to="/forgot-password" className="text-xs font-semibold text-[#003087]">
						¿Olvidaste tu contraseña?
					</Link>
				</div>

				<Button
					type="submit"
					disabled={form.formState.isSubmitting}
					className="w-full bg-[#003087] hover:bg-[#002468]"
				>
					Iniciar sesión
				</Button>

				<div className="my-2 border-t border-[#E0E0E0]" />

				<p className="text-center text-xs font-medium text-[#8a8a8a]">
					¿No tienes cuenta?{" "}
					<Link to="/register" className="font-semibold text-[#003087]">
						Regístrate
					</Link>
				</p>
			</form>
		</div>
	);
}
