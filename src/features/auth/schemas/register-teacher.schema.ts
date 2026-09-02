import { z } from "zod";

export const registerTeacherSchema = z
	.object({
		fullName: z.string().min(3, "Nombre muy corto").max(200),
		email: z.string().email("Correo inválido"),
		password: z.string().min(8, "Mínimo 8 caracteres"),
		confirmPassword: z.string(),
		educationLevel: z.enum(["PRIMARY", "SECONDARY"]),
		isHomeroomTeacher: z.boolean(),
		subjectId: z.string().uuid().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	})
	.refine(
		(data) =>
			data.isHomeroomTeacher ? data.subjectId === undefined : data.subjectId !== undefined,
		{
			message: "Selecciona una materia, o marca 'encargado de sección'",
			path: ["subjectId"],
		},
	);

export type RegisterTeacherFormValues = z.infer<typeof registerTeacherSchema>;
