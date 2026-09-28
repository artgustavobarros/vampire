import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./auth.schemas.js";

function firstMessage(
  schema: typeof signupSchema | typeof loginSchema,
  input: unknown
) {
  const result = schema.safeParse(input);
  return result.success ? null : result.error.issues[0]?.message;
}

const USERNAME_FORMAT =
  "Nome de usuário: 3 a 20 letras, números, _ ou ., começando por letra.";

describe("signupSchema", () => {
  const valid = { email: "a@b.co", name: "a", password: "segredo" };

  it("normaliza e-mail, nome e nome de usuário", () => {
    expect(
      signupSchema.parse({
        email: "  Vitoria@Exemplo.COM ",
        name: " Vitória ",
        password: "segredo",
        username: "  Vitoria_S ",
      })
    ).toEqual({
      email: "vitoria@exemplo.com",
      name: "Vitória",
      password: "segredo",
      username: "vitoria_s",
    });
  });

  it.each([
    [undefined, "Informe o e-mail."],
    [{ name: "a", password: "segredo", username: "ana" }, "Informe o e-mail."],
    [{ ...valid, email: " ", username: "ana" }, "Informe o e-mail."],
    [{ ...valid, password: "", username: "ana" }, "Informe a senha."],
    [{ ...valid, email: "abc", username: "ana" }, "E-mail inválido."],
    [
      { ...valid, password: "12345", username: "ana" },
      "A senha precisa ter pelo menos 6 caracteres.",
    ],
    [{ ...valid, name: "  ", username: "ana" }, "Informe o nome."],
    [
      { email: "a@b.co", password: "segredo", username: "ana" },
      "Informe o nome.",
    ],
    [valid, "Informe o nome de usuário."],
    [{ ...valid, username: "   " }, "Informe o nome de usuário."],
    [{ ...valid, username: "ab" }, USERNAME_FORMAT],
    [{ ...valid, username: "1ana" }, USERNAME_FORMAT],
    [{ ...valid, username: "ana souza" }, USERNAME_FORMAT],
    [{ ...valid, username: "ana@x" }, USERNAME_FORMAT],
    [{ ...valid, username: "a".repeat(21) }, USERNAME_FORMAT],
  ])("recusa %j com %s", (input, message) => {
    expect(firstMessage(signupSchema, input)).toBe(message);
  });

  it.each(["ana", "ana.souza", "a_1", "a".repeat(20)])(
    "aceita o nome de usuário %s",
    (username) => {
      expect(signupSchema.safeParse({ ...valid, username }).success).toBe(true);
    }
  );
});

describe("loginSchema", () => {
  it("normaliza o identificador e aceita qualquer senha não vazia", () => {
    expect(
      loginSchema.parse({ identifier: "  A@B.co ", password: "1" })
    ).toEqual({ identifier: "a@b.co", password: "1" });
    expect(loginSchema.parse({ identifier: "Ana_S", password: "1" })).toEqual({
      identifier: "ana_s",
      password: "1",
    });
  });

  it("recusa campos vazios", () => {
    expect(firstMessage(loginSchema, undefined)).toBe(
      "Informe o e-mail ou usuário."
    );
    expect(firstMessage(loginSchema, { identifier: " ", password: "" })).toBe(
      "Informe o e-mail ou usuário."
    );
    expect(firstMessage(loginSchema, { identifier: "ana", password: "" })).toBe(
      "Informe a senha."
    );
  });
});
