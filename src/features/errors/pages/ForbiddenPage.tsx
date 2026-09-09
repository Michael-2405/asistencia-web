import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ErrorHero } from "../components/ErrorHero";
import { ForbiddenIcon } from "../components/icons/ForbiddenIcon";

export function ForbiddenPage() {
	const navigate = useNavigate();

	return (
		<ErrorHero
			code="403"
			icon={<ForbiddenIcon />}
			title="No tienes permiso para hacer esto"
			description="No cuentas con los permisos necesarios para esta acción."
			actions={
				<Button className="bg-[#003087] hover:bg-[#002468]" onClick={() => navigate("/courses")}>
					Ir a mis cursos
				</Button>
			}
		/>
	);
}
