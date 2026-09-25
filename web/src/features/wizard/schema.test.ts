import { describe, expect, it } from "vitest";
import { blankSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import { applyPredator } from "#/rules/predator";
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
      skills: "Nível 3: falta 1. Nível 2: sobra 1.",
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

  it("passo 5: duas disciplinas do clã, diferentes, 2 e 1, poderes no nível", () => {
    expect(
      issues(
        5,
        values({
          disc: [
            { nivel: 2, nome: "Potência", powers: [] },
            { nivel: 1, nome: "Potência", powers: [] },
          ],
        })
      )
    ).toEqual({ "disc.1.nome": "Escolha duas disciplinas diferentes" });
    expect(
      issues(5, values({ disc: [{ nivel: 0, nome: "", powers: [] }] }))
    ).toEqual({
      "disc.0.nivel": "Marque 2 pontos em uma Disciplina e 1 na outra",
      "disc.0.nome": "Escolha uma disciplina",
      "disc.1.nome": "Escolha uma disciplina",
    });
    expect(
      issues(
        5,
        values({
          disc: [
            { nivel: 2, nome: "Domínio", powers: [] },
            { nivel: 1, nome: "Celeridade", powers: [] },
          ],
        })
      )
    ).toEqual({ "disc.0.nome": "Escolha Disciplinas do clã" });
    expect(
      issues(
        5,
        values({
          disc: [
            { nivel: 1, nome: "Potência", powers: [] },
            { nivel: 1, nome: "Celeridade", powers: [] },
          ],
        })
      )
    ).toEqual({
      "disc.0.nivel": "Marque 2 pontos em uma Disciplina e 1 na outra",
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
            { nivel: 2, nome: "Celeridade", powers: [] },
          ],
        })
      )
    ).toEqual({ "disc.0.powers": "Há poderes acima do nível da disciplina" });
    expect(
      issues(
        5,
        values({
          disc: [
            { nivel: 2, nome: "Potência", powers: [] },
            {
              nivel: 1,
              nome: "Celeridade",
              powers: [
                { nivel: 1, nome: "Graça Felina" },
                { nivel: 1, nome: "Reflexos Rápidos" },
              ],
            },
          ],
        })
      )
    ).toEqual({ "disc.1.powers": "Escolha no máximo 1 poder em Celeridade" });
  });

  it("passo 5: Caitiff escolhe qualquer uma; Sangue Fraco não precisa", () => {
    const disc = [
      { nivel: 2, nome: "Domínio", powers: [] },
      { nivel: 1, nome: "Protean", powers: [] },
    ];
    expect(issues(5, values({ cla: "Caitiff", disc }))).toEqual({});
    expect(issues(5, values({ cla: "Sangue Fraco", disc: [] }))).toEqual({});
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

  it("passo 6: poder do Predador obrigatório e elegível", () => {
    expect(issues(6, values({ predPoder: "" }))).toEqual({
      predPoder: "Escolha um poder de Potência",
    });
    // Potência 2 → 3 aceita nível 3; com 1 ponto, só até 2
    const disc = [
      { nivel: 1, nome: "Potência", powers: [] },
      { nivel: 2, nome: "Celeridade", powers: [] },
    ];
    const nivel3 = "Golpe Brutal";
    expect(issues(6, values({ predPoder: nivel3 }))).toEqual({});
    expect(issues(6, values({ disc, predPoder: nivel3 }))).toEqual({
      predPoder: "Escolha um poder de Potência",
    });
    // sem catálogo, o poder não é exigido
    expect(
      issues(
        6,
        values({
          predador: "Sereia",
          predDisc: "Fascinação",
          predEspec: "Persuasão (Seduzir)",
          predPoder: "",
        })
      )
    ).toEqual({});
  });

  it("passo 6: escolhas do Predador completas", () => {
    const osiris = {
      predador: "Osíris",
      predDisc: "Domínio",
      predEspec: "Ocultismo (culto escolhido)",
      predPoder: "Compelir",
    };
    expect(
      issues(
        6,
        values({
          ...osiris,
          predEscolhas: {
            "inimigos-perseguido": { Inimigos: 2 },
            "rebanho-fama": { Fama: 1, Rebanho: 1 },
          },
        })
      )
    ).toEqual({
      "predEscolhas.rebanho-fama": "Distribua 3 pontos entre Rebanho e Fama",
    });
    expect(
      issues(
        6,
        values({
          ...osiris,
          predEscolhas: {
            "inimigos-perseguido": { Perseguido: 2 },
            "rebanho-fama": { Rebanho: 3 },
          },
        })
      )
    ).toEqual({});
  });

  it("passo 6: Sangue Fraco não tem predador", () => {
    expect(
      issues(
        6,
        values({
          cla: "Sangue Fraco",
          predador: "",
          predDisc: "",
          predEspec: "",
        })
      )
    ).toEqual({});
  });

  it("passo 7: méritos com nome, pontos e cota 7/2", () => {
    expect(
      issues(
        7,
        values({
          meritos: [
            { nome: "Recursos", pontos: 5, tipo: "vantagem" },
            { nome: "Contatos", pontos: 2, tipo: "vantagem" },
            { nome: "Inimigo", pontos: 2, tipo: "defeito" },
            { nome: " ", pontos: 0, tipo: "vantagem" },
          ],
        })
      )
    ).toEqual({
      "meritos.3.nome": "Informe o nome",
      "meritos.3.pontos": "Marque de 1 a 5 pontos",
    });
    expect(issues(7, values({ meritos: [] }))).toEqual({
      meritos:
        "Falta: distribuir 7 pts em vantagens · adquirir 2 pts em defeitos.",
    });
  });

  it("passo 7: Sangue Fraco exige Qualidades e Defeitos SR", () => {
    const meritos = completeSheet().meritos ?? [];
    expect(issues(7, values({ cla: "Sangue Fraco", meritos }))).toEqual({
      meritos: "Falta: ter de 1 a 3 Qualidades de Sangue-Ralo.",
    });
    expect(
      issues(
        7,
        values({
          cla: "Sangue Fraco",
          meritos: [
            ...meritos,
            { nome: "Olfato", pontos: 1, tipo: "qualidade-sr" },
            { nome: "Sem fôlego", pontos: 1, tipo: "defeito-sr" },
          ],
        })
      )
    ).toEqual({});
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

  it("o clã é só contexto nos passos 5, 6 e 7", () => {
    expect(STEP_FIELDS[4]).toEqual(["disc"]);
    expect(STEP_FIELDS[5]).not.toContain("cla");
    expect(STEP_FIELDS[6]).toEqual(["meritos"]);
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

  it("ficha com o Predador aplicado vai até o passo 8", () => {
    expect(firstIncompleteStep(applyPredator(completeSheet()))).toBe(8);
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

  it("lê a ficha sem o Predador aplicado", () => {
    const base = completeSheet({
      predador: "Sereia",
      predDisc: "Fascinação",
      predEspec: "Persuasão (Seduzir)",
    });
    const v = sheetToWizard(applyPredator(base));
    expect(v.disc.map((d) => [d.nome, d.nivel])).toEqual([
      ["Potência", 2],
      ["Celeridade", 1],
    ]);
    expect(v.meritos).toEqual(base.meritos);
  });

  it("lê a ficha sem o poder do Predador", () => {
    const base = completeSheet();
    const v = sheetToWizard(applyPredator(base));
    expect(v.disc).toEqual(base.disc);
    expect(v.predPoder).toBe("Força Prodigiosa");
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

  it("descarta especialidades vazias", () => {
    const v = values({ espec: { Briga: [], Esportes: ["Corrida", ""] } });
    expect(wizardToPatch(v, ["espec"], completeSheet()).espec).toEqual({
      Esportes: ["Corrida"],
    });
  });

  it("Sangue Fraco grava predador e disciplinas do assistente vazios", () => {
    const sheet = completeSheet({ cla: "Sangue Fraco" });
    sheet.disc.push({ nivel: 1, nome: "Presença", powers: [] });
    const v = sheetToWizard(sheet);
    expect(wizardToPatch(v, STEP_FIELDS[5], sheet)).toEqual({
      predador: "",
      predDisc: "",
      predEscolhas: {},
      predEspec: "",
      predPoder: "",
    });
    expect(
      wizardToPatch(v, STEP_FIELDS[4], sheet).disc?.map((d) => d.nome)
    ).toEqual(["", "", "Presença"]);
  });

  it("outra especialidade do Predador volta a ficar pendente", () => {
    const sheet = completeSheet({
      predEspec: "Briga (Agarrar)",
      predEspecNome: "Mata-leão",
    });
    const same = wizardToPatch(sheetToWizard(sheet), STEP_FIELDS[5], sheet);
    expect("predEspecNome" in same).toBe(false);
    const v = values({ predEspec: "Furtividade (Emboscada)" });
    const other = wizardToPatch(v, STEP_FIELDS[5], sheet);
    expect("predEspecNome" in other).toBe(true);
    expect(other.predEspecNome).toBeUndefined();
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
