import type { AccountUpdate } from "./api";
import {
  EMAIL,
  MIN_PASSWORD,
  normalize,
  SHORT_PASSWORD,
  USERNAME,
  USERNAME_FORMAT,
} from "./auth";

/** Nome, nome de usuário e e-mail como aparecem na página "Conta". */
export interface AccountValues {
  email: string;
  name: string;
  username: string;
}

export const CURRENT_PASSWORD_REQUIRED = "Informe a senha atual.";

/** Os campos do formulário, normalizados como a API guarda, que mudaram. */
export function accountDiff(
  current: AccountValues,
  form: AccountValues
): Pick<AccountUpdate, "email" | "name" | "username"> {
  const diff: Pick<AccountUpdate, "email" | "name" | "username"> = {};
  const name = form.name.trim();
  const username = normalize(form.username);
  const email = normalize(form.email);
  if (name !== current.name) {
    diff.name = name;
  }
  if (username !== current.username) {
    diff.username = username;
  }
  if (email !== current.email) {
    diff.email = email;
  }
  return diff;
}

/** Mesmas regras e mensagens da API, na ordem dos campos. */
export function validateAccountData(
  diff: Pick<AccountUpdate, "email" | "name" | "username">,
  currentPassword?: string
): string | null {
  if (diff.name === "") {
    return "Informe o nome.";
  }
  if (diff.username !== undefined) {
    if (!diff.username) {
      return "Informe o nome de usuário.";
    }
    if (!USERNAME.test(diff.username)) {
      return USERNAME_FORMAT;
    }
  }
  if (diff.email !== undefined) {
    if (!diff.email) {
      return "Informe o e-mail.";
    }
    if (!EMAIL.test(diff.email)) {
      return "E-mail inválido.";
    }
    if (currentPassword === "") {
      return CURRENT_PASSWORD_REQUIRED;
    }
  }
  return null;
}

/** `currentPassword` ausente = o Mestre, que não precisa dela. */
export function validateNewPassword({
  currentPassword,
  password,
  password2,
}: {
  currentPassword?: string;
  password: string;
  password2: string;
}): string | null {
  if (currentPassword === "") {
    return CURRENT_PASSWORD_REQUIRED;
  }
  if (!password) {
    return "Informe a nova senha.";
  }
  if (password.length < MIN_PASSWORD) {
    return SHORT_PASSWORD;
  }
  if (password !== password2) {
    return "As senhas não conferem.";
  }
  return null;
}
