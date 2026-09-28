import { describe, expect, it } from "vitest";
import {
  accountDiff,
  validateAccountData,
  validateNewPassword,
} from "./account";

const current = { email: "ana@exemplo.com", name: "Ana", username: "ana" };

describe("accountDiff", () => {
  it("só os campos que mudaram, normalizados", () => {
    expect(
      accountDiff(current, {
        email: " ANA@exemplo.com ",
        name: " Ana ",
        username: " Ana_S ",
      })
    ).toEqual({ username: "ana_s" });
  });

  it("nada mudou", () => {
    expect(accountDiff(current, current)).toEqual({});
  });
});

describe("validateAccountData", () => {
  it.each([
    [{ name: "" }, undefined, "Informe o nome."],
    [{ username: "" }, undefined, "Informe o nome de usuário."],
    [
      { username: "1ana" },
      undefined,
      "Nome de usuário: 3 a 20 letras, números, _ ou ., começando por letra.",
    ],
    [{ email: "" }, "x", "Informe o e-mail."],
    [{ email: "abc" }, "x", "E-mail inválido."],
    [{ email: "b@exemplo.com" }, "", "Informe a senha atual."],
  ])("%j (senha atual %j) → %s", (diff, currentPassword, message) => {
    expect(validateAccountData(diff, currentPassword)).toBe(message);
  });

  it("aceita e-mail sem senha atual quando ela não é pedida", () => {
    expect(validateAccountData({ email: "b@exemplo.com" })).toBeNull();
  });
});

describe("validateNewPassword", () => {
  it.each([
    [
      { currentPassword: "", password: "123456", password2: "123456" },
      "Informe a senha atual.",
    ],
    [
      { currentPassword: "x", password: "", password2: "" },
      "Informe a nova senha.",
    ],
    [
      { password: "123", password2: "123" },
      "A senha precisa ter pelo menos 6 caracteres.",
    ],
    [{ password: "123456", password2: "654321" }, "As senhas não conferem."],
    [{ password: "123456", password2: "123456" }, null],
  ])("%j → %s", (input, message) => {
    expect(validateNewPassword(input)).toBe(message);
  });
});
