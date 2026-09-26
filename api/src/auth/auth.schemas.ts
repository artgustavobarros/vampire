import { z } from "zod";
import { publicUserSchema } from "../users/users.schemas.js";

const MISSING = "Informe e-mail e senha.";

const email = z
  .string({ error: MISSING })
  .trim()
  .toLowerCase()
  .min(1, MISSING)
  // o OpenAPI do corpo só enxerga o lado de entrada do `pipe`
  .meta({ format: "email" })
  .pipe(z.email("E-mail inválido."));

const password = z.string({ error: MISSING }).min(1, MISSING);

// a ordem das chaves é a ordem das mensagens: a primeira falha vira o toast
export const signupSchema = z.object(
  {
    email,
    name: z
      .string({ error: "Informe o nome." })
      .trim()
      .min(1, "Informe o nome."),
    password: password.min(6, "A senha precisa ter pelo menos 6 caracteres."),
  },
  { error: MISSING }
);

export const loginSchema = z.object({ email, password }, { error: MISSING });

export const authResponseSchema = z.object({
  accessToken: z
    .string()
    .meta({ description: "JWT para `Authorization: Bearer`" }),
  user: publicUserSchema,
});

export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
