import { z } from "zod";
import {
  EMAIL_REQUIRED,
  emailField,
  nameField,
  newPasswordField,
  optionalUsernameField,
  passwordField,
  publicUserSchema,
} from "../users/users.schemas.js";

const IDENTIFIER_REQUIRED = "Informe o e-mail ou usuário.";

// a ordem das chaves é a ordem das mensagens: a primeira falha vira o toast
export const signupSchema = z.object(
  {
    email: emailField,
    name: nameField,
    password: newPasswordField,
    username: optionalUsernameField,
  },
  { error: EMAIL_REQUIRED }
);

export const loginSchema = z.object(
  {
    identifier: z
      .string({ error: IDENTIFIER_REQUIRED })
      .trim()
      .toLowerCase()
      .min(1, IDENTIFIER_REQUIRED)
      .meta({ description: "E-mail (se tiver `@`) ou nome de usuário" }),
    password: passwordField,
  },
  { error: IDENTIFIER_REQUIRED }
);

export const authResponseSchema = z.object({
  accessToken: z
    .string()
    .meta({ description: "JWT para `Authorization: Bearer`" }),
  user: publicUserSchema,
});

export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
