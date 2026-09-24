import { describe, expect, it } from "vitest";
import { blankSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import {
  ALL_FIELDS,
  firstIncompleteStep,
  isStepValid,
  STEP_FIELDS,
  STEP_SCHEMAS,
  sheetToWizard,
  type WizardValues,
  wizardToPatch,
} from "./schema";
import { completeSheet } from "./test-fixtures";

const values = (over: Partial<Sheet> = {}): WizardValues =>
  sheetToWizard(completeSheet(over));

/** Mensagens de erro do passo, por caminho ("espec.Ofícios"). */
function issues(step: number, v: WizardValues): Record<string, string> {
  const result = STEP_SCHEMAS[step - 1].safeParse(v);
  if (result.success) {
    return {};
  }
  return Object.fromEntries(
    result.error.issues.map((i) => [i.path.join("."), i.message])
  );
}

describe("schemas do assistente", () => {
  it("a ficha completa passa em todos os passos", () => {
    const v = values();
    for (let step = 1; step <= 8; step += 1) {
      expect(issues(step, v)).toEqual({});
    }
  });

  it("passo 1: clã e geração obrigatórios", () => {
    expect(issues(1, values({ cla: "", geracao: "" }))).toEqual({
      cla: "Escolha um clã",
      geracao: "Escolha a geração",
    });
  });

  it("passo 2: cota de atributos", () => {
    const base = completeSheet().attrs;
    expect(issues(2, values({ attrs: { ...base, Carisma: 4 } }))).toEqual({
      attrs: "Você passou de alguma cota: ajuste os pontos.",
    });
    expect(issues(2, values({ attrs: { ...base, Carisma: 2 } }))).toEqual({
      attrs: "1 escolha restante.",
    });
    expect(issues(2, values({ attrs: { ...base, Inteligência: 5 } }))).toEqual({
      attrs: "Os atributos ficam entre 1 e 4; os que sobram ficam em 2.",
    });
  });

  it("passo 3: distribuição escolhida e completa", () => {
    expect(issues(3, values({ dist: "" }))).toHaveProperty("dist");
    const skills = { ...completeSheet().skills, Persuasão: 2 };
    expect(issues(3, values({ skills }))).toEqual({
      skills:
        "Distribuição incompleta: ajuste as habilidades ao formato escolhido.",
    });
  });

  it("passo 4: especialidade obrigatória e livre", () => {
    const skills = { ...completeSheet().skills, Ofícios: 2 };
    expect(issues(4, values({ skills }))).toEqual({
      "espec.Ofícios": "Informe uma especialidade",
    });
    expect(
      issues(4, values({ espec: { Ofícios: ["Marcenaria"] }, skills }))
    ).toEqual({});
    expect(issues(4, values({ especLivre: "" }))).toEqual({
      especLivre: "Escolha uma habilidade com pontos",
    });
    expect(issues(4, values({ espec: {} }))).toEqual({
      "espec.Briga": "Informe uma especialidade",
    });
  });

  it("passo 5: duas disciplinas diferentes, com nível e poderes no nível", () => {
    expect(
      issues(
        5,
        values({
          disc: [
            { nivel: 1, nome: "Potência", powers: [] },
            { nivel: 1, nome: "Potência", powers: [] },
          ],
        })
      )
    ).toEqual({ "disc.1.nome": "Escolha duas disciplinas diferentes" });
    expect(
      issues(5, values({ disc: [{ nivel: 0, nome: "", powers: [] }] }))
    ).toEqual({
      "disc.0.nivel": "Marque o nível da disciplina",
      "disc.0.nome": "Escolha uma disciplina",
      "disc.1.nivel": "Marque o nível da disciplina",
      "disc.1.nome": "Escolha uma disciplina",
    });
    expect(
      issues(
        5,
        values({
          disc: [
            {
              nivel: 1,
              nome: "Potência",
              powers: [{ nivel: 2, nome: "Salto" }],
            },
            { nivel: 1, nome: "Celeridade", powers: [] },
          ],
        })
      )
    ).toEqual({ "disc.0.powers": "Há poderes acima do nível da disciplina" });
  });

  it("passo 6: predador completo", () => {
    expect(issues(6, values({ predDisc: "" }))).toEqual({
      predDisc: "Escolha uma disciplina",
    });
    expect(issues(6, values({ predDisc: "Presença" }))).toEqual({
      predDisc: "Escolha uma disciplina",
    });
    expect(issues(6, values({ predador: "" }))).toHaveProperty("predador");
  });

  it("passo 7: méritos com nome e pontos; lista vazia vale", () => {
    expect(
      issues(
        7,
        values({ meritos: [{ nome: " ", pontos: 0, tipo: "vantagem" }] })
      )
    ).toEqual({
      "meritos.0.nome": "Informe o nome",
      "meritos.0.pontos": "Marque de 1 a 5 pontos",
    });
    expect(issues(7, values({ meritos: [] }))).toEqual({});
  });

  it("passo 8: nome obrigatório", () => {
    expect(issues(8, values({ nome: "  " }))).toEqual({
      nome: "Informe o nome do personagem",
    });
  });
});

describe("campos por passo", () => {
  it("contexto não é gravado pelo passo 4", () => {
    expect(STEP_FIELDS[3]).toEqual(["espec", "especLivre"]);
    expect(STEP_FIELDS[2]).toContain("skills");
  });

  it("todos os campos do formulário pertencem a algum passo", () => {
    expect(new Set(ALL_FIELDS)).toEqual(new Set(Object.keys(values())));
  });
});

describe("firstIncompleteStep", () => {
  it("ficha em branco começa no passo 1", () => {
    expect(firstIncompleteStep(blankSheet())).toBe(1);
  });

  it("para no primeiro passo inválido", () => {
    expect(firstIncompleteStep(completeSheet({ dist: "" }))).toBe(3);
  });

  it("ficha completa vai até o passo 8", () => {
    expect(firstIncompleteStep(completeSheet())).toBe(8);
    expect(isStepValid(8, values())).toBe(true);
  });
});

describe("mapeamento ficha ↔ formulário", () => {
  it("completa disciplinas até duas posições", () => {
    const v = sheetToWizard(blankSheet());
    expect(v.disc).toEqual([
      { nivel: 0, nome: "", powers: [] },
      { nivel: 0, nome: "", powers: [] },
    ]);
    expect(v.nome).toBe("");
  });

  it("ida e volta preserva os valores", () => {
    const sheet = completeSheet({
      ambicao: "a",
      conceito: "c",
      cronica: "cr",
      desejo: "d",
      potencia: 1,
      senhor: "s",
    });
    const patch = wizardToPatch(sheetToWizard(sheet), ALL_FIELDS, sheet);
    expect({ ...sheet, ...patch }).toEqual(sheet);
  });

  it("grava só os campos pedidos e recalcula a potência", () => {
    const v = values({ geracao: "9ª" });
    expect(wizardToPatch(v, STEP_FIELDS[0], completeSheet())).toEqual({
      cla: "Brujah",
      geracao: "9ª",
      potencia: 2,
      senhor: "",
    });
  });

  it("preserva disciplinas além das duas do assistente", () => {
    const sheet = completeSheet();
    sheet.disc.push({ nivel: 1, nome: "Presença", powers: [] });
    const patch = wizardToPatch(sheetToWizard(sheet), ["disc"], sheet);
    expect(patch.disc?.map((d) => d.nome)).toEqual([
      "Potência",
      "Celeridade",
      "Presença",
    ]);
  });
});
