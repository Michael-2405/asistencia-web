import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ErrorHero } from "../components/ErrorHero";
import { SignInRequiredIcon } from "../components/icons/SignInRequiredIcon";

export function UnauthenticatedPage() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col">
			<ErrorHero
				code="401"
				icon={<SignInRequiredIcon />}
				title="Necesitas iniciar sesión"
				description="Para acceder a esta sección debes estar autenticado."
				actions={
					<Button className="bg-[#003087] hover:bg-[#002468]" onClick={() => navigate("/login")}>
						Ir al inicio de sesión
					</Button>
				}
			/>
		</div>
	);
}
