import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./auth.schemas.js";

function firstMessage(
  schema: typeof signupSchema | typeof loginSchema,
  input: unknown
) {
  const result = schema.safeParse(input);
  return result.success ? null : result.error.issues[0]?.message;
}

describe("signupSchema", () => {
  it("normaliza e-mail e nome", () => {
    expect(
      signupSchema.parse({
        email: "  Vitoria@Exemplo.COM ",
        name: " Vitória ",
        password: "segredo",
      })
    ).toEqual({
      email: "vitoria@exemplo.com",
      name: "Vitória",
      password: "segredo",
    });
  });

  it.each([
    [undefined, "Informe o e-mail."],
    [{ name: "a", password: "segredo" }, "Informe o e-mail."],
    [{ email: " ", name: "a", password: "segredo" }, "Informe o e-mail."],
    [{ email: "a@b.co", name: "a", password: "" }, "Informe a senha."],
    [{ email: "abc", name: "a", password: "segredo" }, "E-mail inválido."],
    [
      { email: "a@b.co", name: "a", password: "12345" },
      "A senha precisa ter pelo menos 6 caracteres.",
    ],
    [{ email: "a@b.co", name: "  ", password: "segredo" }, "Informe o nome."],
    [{ email: "a@b.co", password: "segredo" }, "Informe o nome."],
  ])("recusa %j com %s", (input, message) => {
    expect(firstMessage(signupSchema, input)).toBe(message);
  });
});

describe("loginSchema", () => {
  it("aceita qualquer senha não vazia", () => {
    expect(loginSchema.parse({ email: "A@B.co", password: "1" })).toEqual({
      email: "a@b.co",
      password: "1",
    });
  });

  it("recusa campos vazios", () => {
    expect(firstMessage(loginSchema, { email: "", password: "" })).toBe(
      "Informe o e-mail."
    );
    expect(firstMessage(loginSchema, { email: "abc", password: "" })).toBe(
      "E-mail inválido."
    );
    expect(firstMessage(loginSchema, { email: "a@b.co", password: "" })).toBe(
      "Informe a senha."
    );
  });
});
