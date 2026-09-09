import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ErrorHero } from "../components/ErrorHero";
import { ServerErrorIcon } from "../components/icons/ServerErrorIcon";
import { TechnicalDetailAccordion } from "../components/TechnicalDetailAccordion";

interface ServerErrorPageProps {
	errorMessage?: string;
	requestId?: string;
}

export function ServerErrorPage({ errorMessage, requestId }: ServerErrorPageProps) {
	const navigate = useNavigate();

	return (
		<ErrorHero
			code="500"
			icon={<ServerErrorIcon />}
			title="Algo salió mal de nuestro lado"
			description="Ocurrió un error inesperado. Nuestro equipo ya fue notificado y estamos trabajando para resolverlo."
			actions={
				<>
					<Button
						variant="outline"
						className="border-[1.5px] border-[#d5d8dc] text-[#5b5f66]"
						onClick={() => navigate("/courses")}
					>
						Ir a mis cursos
					</Button>
					<Button
						className="bg-[#003087] hover:bg-[#002468]"
						onClick={() => window.location.reload()}
					>
						Intentar de nuevo
					</Button>
				</>
			}
			footnote="Si el problema persiste, contacta al soporte técnico."
		>
			{errorMessage && <TechnicalDetailAccordion message={errorMessage} requestId={requestId} />}
		</ErrorHero>
	);
}
