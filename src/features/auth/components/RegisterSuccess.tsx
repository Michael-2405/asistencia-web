import { useNavigate } from "react-router-dom";
import { AuthSuccessScreen } from "./AuthSuccessScreen";

export function RegisterSuccess() {
	const navigate = useNavigate();

	return (
		<AuthSuccessScreen
			title="Cuenta creada"
			description="Revisa tu correo para confirmar tu email antes de iniciar sesión."
			buttonLabel="Ir al inicio de sesión"
			onButtonClick={() => navigate("/login")}
		/>
	);
}
