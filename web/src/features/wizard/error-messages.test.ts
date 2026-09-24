import type { FieldErrors } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { collectErrorMessages, formatStepErrors } from "./error-messages";
import type { WizardValues } from "./schema";

const err = (message: string) => ({ message, type: "custom" });

describe("mensagens de erro do passo", () => {
  it("coleta erros aninhados em registros e listas", () => {
    const errors = {
      disc: [undefined, { nome: err("Escolha uma disciplina") }],
      espec: { Ofícios: err("Informe uma especialidade") },
      meritos: [{ nome: err("Informe o nome") }],
    } as unknown as FieldErrors<WizardValues>;
    expect(collectErrorMessages(errors)).toEqual([
      "Escolha uma disciplina.",
      "Informe uma especialidade.",
      "Informe o nome.",
    ]);
  });

  it("não repete a mesma mensagem nem desce no ref", () => {
    const errors = {
      espec: {
        Ciência: { ...err("Informe uma especialidade"), ref: { a: err("x") } },
        Ofícios: err("Informe uma especialidade"),
      },
    } as unknown as FieldErrors<WizardValues>;
    expect(collectErrorMessages(errors)).toEqual([
      "Informe uma especialidade.",
    ]);
  });

  it("mantém a pontuação existente", () => {
    const errors = {
      skills: err("Nível 3: falta 1."),
    } as unknown as FieldErrors<WizardValues>;
    expect(collectErrorMessages(errors)).toEqual(["Nível 3: falta 1."]);
  });

  it("corta em três e resume o resto", () => {
    expect(formatStepErrors(["A.", "B."])).toBe("A. B.");
    expect(formatStepErrors(["A.", "B.", "C.", "D.", "E."])).toBe(
      "A. B. C. …e mais 2."
    );
  });
});
