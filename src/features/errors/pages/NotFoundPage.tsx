import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ErrorHero } from "../components/ErrorHero";
import { NotFoundIcon } from "../components/icons/NotFoundIcon";

export function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<ErrorHero
			code="404"
			icon={<NotFoundIcon />}
			title="No encontramos lo que buscas"
			description="Es posible que la página haya sido movida, eliminada o que no tengas acceso a ella."
			actions={
				<>
					<Button
						variant="outline"
						className="border-[1.5px] border-[#d5d8dc] text-[#5b5f66]"
						onClick={() => navigate(-1)}
					>
						Volver atrás
					</Button>
					<Button className="bg-[#003087] hover:bg-[#002468]" onClick={() => navigate("/courses")}>
						Ir a mis cursos
					</Button>
				</>
			}
		/>
	);
}
