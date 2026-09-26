import { z } from "zod";

const MISSING = "Informe e-mail e senha.";

const email = z
  .string({ error: MISSING })
  .trim()
  .toLowerCase()
  .min(1, MISSING)
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

export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
