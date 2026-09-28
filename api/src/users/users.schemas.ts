import { z } from "zod";

/** O usuário como sai da API, sem o hash da senha. */
export const publicUserSchema = z.object({
  email: z.email(),
  id: z.uuid(),
  name: z.string(),
  role: z.enum(["player", "dm"]).meta({
    description:
      "`player` (padrão) ou `dm` (Mestre, vê e edita todas as fichas)",
  }),
  username: z.string(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;

export const EMAIL_REQUIRED = "Informe o e-mail.";
const PASSWORD_REQUIRED = "Informe a senha.";
const USERNAME_REQUIRED = "Informe o nome de usuário.";
const NAME_REQUIRED = "Informe o nome.";

/** Sem `@`, então o login distingue o usuário do e-mail por ele. */
export const USERNAME_FORMAT = /^[a-z][a-z0-9_.]{2,19}$/;

// campos do cadastro e da edição da conta, com as mesmas mensagens

export const emailField = z
  .string({ error: EMAIL_REQUIRED })
  .trim()
  .toLowerCase()
  .min(1, EMAIL_REQUIRED)
  // o OpenAPI do corpo só enxerga o lado de entrada do `pipe`
  .meta({ format: "email" })
  .pipe(z.email("E-mail inválido."));

export const nameField = z
  .string({ error: NAME_REQUIRED })
  .trim()
  .min(1, NAME_REQUIRED);

export const passwordField = z
  .string({ error: PASSWORD_REQUIRED })
  .min(1, PASSWORD_REQUIRED);

export const newPasswordField = passwordField.min(
  6,
  "A senha precisa ter pelo menos 6 caracteres."
);

const usernameFormat = z
  .string()
  .regex(
    USERNAME_FORMAT,
    "Nome de usuário: 3 a 20 letras, números, _ ou ., começando por letra."
  );

export const usernameField = z
  .string({ error: USERNAME_REQUIRED })
  .trim()
  .toLowerCase()
  .min(1, USERNAME_REQUIRED)
  .pipe(usernameFormat);

/** No cadastro: vazio ou só espaços vira ausente, e a API gera um do nome. */
export const optionalUsernameField = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .transform((value) => value || undefined)
  .pipe(usernameFormat.optional())
  .meta({ description: "Opcional: sem ele, é gerado a partir do nome" });

export const updateAccountSchema = z.object(
  {
    currentPassword: z.string().optional().meta({
      description:
        "Senha atual; exigida em `PATCH /me/account` para mudar e-mail ou senha",
    }),
    email: emailField.optional(),
    name: nameField.optional(),
    password: newPasswordField.optional().meta({ description: "Senha nova" }),
    username: usernameField.optional(),
  },
  { error: "Dados da conta inválidos." }
);

export type UpdateAccountDto = z.infer<typeof updateAccountSchema>;
