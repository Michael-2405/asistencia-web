import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ErrorHero } from "../components/ErrorHero";
import { SessionExpiredIcon } from "../components/icons/SessionExpiredIcon";

export function SessionExpiredPage() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col">
			<ErrorHero
				code="401"
				icon={<SessionExpiredIcon />}
				title="Tu sesión ha expirado"
				description="Por seguridad, las sesiones se cierran automáticamente después de un período de inactividad."
				actions={
					<Button className="bg-[#003087] hover:bg-[#002468]" onClick={() => navigate("/login")}>
						Iniciar sesión nuevamente
					</Button>
				}
				footnote="Tus datos están guardados. No perdiste ningún cambio."
			/>
		</div>
	);
}
