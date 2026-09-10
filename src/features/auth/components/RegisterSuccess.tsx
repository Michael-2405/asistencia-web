import { useNavigate } from "react-router-dom";
import { AuthSuccessScreen } from "./AuthSuccessScreen";

export function RegisterSuccess({ email }: { email: string }) {
	const navigate = useNavigate();

	return (
		<AuthSuccessScreen
			title="¡Cuenta creada!"
			description={`Tu cuenta ha sido creada. Revisa tu correo ${email} para confirmar tu email antes de iniciar sesión.`}
			buttonLabel="Ir a Iniciar sesión"
			onButtonClick={() => navigate("/login")}
		/>
	);
}
