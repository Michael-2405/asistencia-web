import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { AuthLayout } from "../components/AuthLayout";
import { StatusBanner } from "../components/StatusBanner";
import { authClient } from "../lib/auth-client";

const loginSchema = z.object({
	email: z.string().email("Correo inválido"),
	password: z.string().min(1, "Requerido"),
});

const FIELD_CLASS =
	"rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#003087] w-full box-border";

export function LoginPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
	const [useBackupCode, setUseBackupCode] = useState(false);
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [verifying, setVerifying] = useState(false);

	const loginForm = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
		setError(null);
		const { data, error: signInError } = await authClient.signIn.email(values);

		if (signInError) {
			setError("Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.");
			return;
		}

		if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
			setRequiresTwoFactor(true);
			return;
		}

		navigate("/courses");
	}

	async function onVerify() {
		setError(null);
		setVerifying(true);

		const result = useBackupCode
			? await authClient.twoFactor.verifyBackupCode({ code })
			: await authClient.twoFactor.verifyTotp({ code });

		setVerifying(false);

		if (result.error) {
			setError(useBackupCode ? "Código de recuperación inválido" : "Código inválido");
			return;
		}

		navigate("/courses");
	}

	function toggleBackupCode() {
		setUseBackupCode((v) => !v);
		setCode("");
		setError(null);
	}

	return (
		<AuthLayout
			tagline="Ingresa con tu correo institucional"
			footerNote="Herramienta oficial del MINERD para el registro de asistencia y calificaciones."
		>
			<h2 className="text-2xl font-bold text-[#1a1a1a]">
				{requiresTwoFactor ? "Verificación en dos pasos" : "Iniciar sesión"}
			</h2>
			<p className="mt-1.5 text-[13px] font-medium text-[#6b6b6b]">
				{requiresTwoFactor
					? useBackupCode
						? "Ingresa uno de tus códigos de recuperación"
						: "Ingresa el código de tu app de autenticación"
					: "Ingresa con tu correo institucional"}
			</p>

			{error && (
				<div className="mt-5">
					<StatusBanner variant="error">{error}</StatusBanner>
				</div>
			)}

			{requiresTwoFactor ? (
				<div className="mt-6 flex flex-col gap-4">
					<input
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder={useBackupCode ? "XXXX-XXXX" : "000000"}
						maxLength={useBackupCode ? 9 : 6}
						className="w-full rounded-lg border-[1.5px] border-[#E0E0E0] py-3.5 text-center font-bold text-2xl tracking-[6px] outline-none focus:border-[#003087]"
					/>
					<Button
						type="button"
						onClick={onVerify}
						disabled={!code || verifying}
						className="w-full bg-[#003087] hover:bg-[#002468]"
					>
						{verifying ? "Verificando…" : "Verificar"}
					</Button>
					<button
						type="button"
						onClick={toggleBackupCode}
						className="text-center text-xs font-semibold text-[#003087]"
					>
						{useBackupCode ? "Usar código de la app" : "Usar código de recuperación"}
					</button>
				</div>
			) : (
				<form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="mt-6 flex flex-col gap-4">
					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">
							Correo electrónico institucional
						</span>
						<input
							type="email"
							{...loginForm.register("email")}
							placeholder="nombre.apellido@minerd.edu.do"
							className={FIELD_CLASS}
						/>
					</label>

					<label className="flex flex-col gap-1.5">
						<span className="text-xs font-semibold text-[#333]">Contraseña</span>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								{...loginForm.register("password")}
								className={`${FIELD_CLASS} pr-11`}
							/>
							<button
								type="button"
								onClick={() => setShowPassword((s) => !s)}
								className="absolute inset-y-1 right-1 w-9 text-[11px] font-medium text-[#6b6b6b]"
							>
								{showPassword ? "Ocultar" : "Mostrar"}
							</button>
						</div>
					</label>

					<div className="text-right">
						<Link to="/forgot-password" className="text-xs font-semibold text-[#003087]">
							¿Olvidaste tu contraseña?
						</Link>
					</div>

					<Button
						type="submit"
						disabled={loginForm.formState.isSubmitting}
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
			)}
		</AuthLayout>
	);
}
