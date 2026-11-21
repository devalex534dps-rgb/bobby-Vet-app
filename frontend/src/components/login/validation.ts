import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "Ingresa un formato de correo electrónico válido" }),
  password: z
    .string()
    .min(1, { message: "La contraseña es obligatoria" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  rememberMe: z.boolean().default(true),
});

export type LoginSchema = z.infer<typeof loginSchema>;
