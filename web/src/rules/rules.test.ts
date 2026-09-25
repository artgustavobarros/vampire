import { describe, expect, it } from "vitest";
import { DISCIPLINES } from "#/data/disciplines";
import { blankSheet } from "#/lib/sheet";
import type { DamageMark, Merit, Power, Sheet } from "#/lib/types";
import { bloodSurgeNote, healAggravated, rouseCheck, sleep } from "./actions";
import { nextDotValue } from "./dots";
import { FEEDING_SOURCES, feed, feedingYield } from "./feeding";
import { potencyFromGeneration, potencyNote, sireNote } from "./generation";
import { adjustHumanity, stains, toggleStain } from "./humanity";
import { hungerAlertFor } from "./hunger";
import { specialtiesBySkill } from "./specialties";
import { addDamage, cycleBox, trackBoxes, vitalityMax } from "./tracks";
import {
  attributeQuotas,
  clanDisciplineOptions,
  disciplineDistribution,
  effectiveMeritKind,
  initialAttributes,
  meritKinds,
  meritStatus,
  meritTotals,
  powerLimitHint,
  powerToggleBlock,
  skillDistributionCheck,
  skillDistributionProgress,
  trimPowers,
} from "./wizard";

const sheet = (over: Partial<Sheet> = {}): Sheet => ({
  ...blankSheet(),
  ...over,
});
const source = (name: string) => {
  const s = FEEDING_SOURCES.find((x) => x.name === name);
  if (!s) {
    throw new Error(name);
  }
  return s;
};

describe("pontos", () => {
  it("define o valor clicado ou diminui 1 no atual", () => {
    expect(nextDotValue(1, 3)).toBe(3);
    expect(nextDotValue(3, 3)).toBe(2);
    expect(nextDotValue(1, 1)).toBe(0);
  });
});

describe("trilhas", () => {
  it("vitalidade é Vigor + 3 e preserva marcas", () => {
    const s = sheet({
      attrs: { ...blankSheet().attrs, Vigor: 3 },
      vit: [1, 2],
    });
    expect(vitalityMax(s)).toBe(6);
    expect(trackBoxes(s.vit, 6)).toEqual([1, 2, 0, 0, 0, 0]);
  });

  it("ciclo vazio → superficial → agravado → vazio", () => {
    let m: DamageMark[] = [0];
    m = cycleBox(m, 0);
    expect(m).toEqual([1]);
    m = cycleBox(m, 0);
    expect(m).toEqual([2]);
    expect(cycleBox(m, 0)).toEqual([0]);
  });

  it("transbordo converte o primeiro superficial em agravado", () => {
    const r = addDamage([1, 1, 1, 1], 1);
    expect(r.marks).toEqual([2, 1, 1, 1]);
    expect(r.overflow).toBe(1);
  });
});

describe("Rouse Check", () => {
  it("passou não muda a Fome", () => {
    const r = rouseCheck(sheet({ fome: 2 }), true, true);
    expect(r.patch).toEqual({});
    expect(r.note).toBe("Fome permanece em 2. Sem alteração.");
  });
  it("falhou sobe a Fome", () => {
    const r = rouseCheck(sheet({ fome: 2 }), false, true);
    expect(r.patch.fome).toBe(3);
    expect(r.note).toBe("Fome sobe para 3.");
  });
  it("chegar a 5 avisa frenesi", () => {
    const r = rouseCheck(sheet({ fome: 4 }), false, true);
    expect(r.patch.fome).toBe(5);
    expect(r.note).toContain("Frenesi de Fome");
  });
  it("não passa de 5", () => {
    expect(rouseCheck(sheet({ fome: 5 }), false, true).patch.fome).toBe(5);
  });
  it("surto usa o bônus da Potência", () => {
    expect(bloodSurgeNote(sheet({ geracao: "12ª" }))).toBe(
      "Surto de Sangue: adicione 2 dados ao teste."
    );
  });
});

describe("dormir", () => {
  it("cura superficial pela Potência e restaura Força de Vontade", () => {
    const s = sheet({
      attrs: {
        ...blankSheet().attrs,
        Autocontrole: 2,
        Determinação: 3,
        Vigor: 2,
      },
      fdv: [1, 1, 1, 1, 0],
      geracao: "12ª",
      vit: [1, 1, 0, 0, 0],
    });
    const r = sleep(s, true);
    expect(r.patch.vit).toEqual([1, 0, 0, 0, 0]);
    expect(r.patch.fdv).toEqual([1, 0, 0, 0, 0]);
    expect(r.patch.noites).toBe(1);
  });
  it("sem dano", () => {
    expect(sleep(sheet(), true).note).toBe("Nada a curar nesta noite.");
  });
});

describe("cura agravada", () => {
  it("uma falha: agravado vira superficial e Fome +1", () => {
    const r = healAggravated(sheet({ fome: 1, vit: [2, 0, 0, 0] }), 1);
    expect(r.patch.vit).toEqual([1, 0, 0, 0]);
    expect(r.patch.fome).toBe(2);
  });
  it("sem agravado só ajusta a Fome", () => {
    const r = healAggravated(sheet({ fome: 1 }), 2);
    expect(r.patch).toEqual({ fome: 3 });
    expect(r.note).toContain("Nenhum dano agravado marcado na vitalidade.");
  });
});

describe("alimentação", () => {
  it("animal grande rende metade na Potência 2", () => {
    const y = feedingYield(source("Animal grande"), 2);
    expect(y.amount).toBe(1);
    expect(feed(sheet({ fome: 3 }), y.amount, "Animal grande").patch.fome).toBe(
      2
    );
  });
  it("bolsa não sacia na Potência 3", () => {
    const y = feedingYield(source("Bolsa de sangue"), 3);
    expect(y.amount).toBe(0);
    expect(y.warning).toBe("Sangue de bolsa não sacia na Potência 3.");
  });
  it("pessoa não sacia na Potência 4, matar sim", () => {
    expect(feedingYield(source("Pessoa"), 4).amount).toBe(0);
    expect(feedingYield(source("Matar a pessoa"), 4).amount).toBe(5);
  });
  it("Fome nunca fica negativa", () => {
    expect(feed(sheet({ fome: 2 }), 3, "Pessoa").patch.fome).toBe(0);
  });
});

describe("alerta de Fome", () => {
  it("só quando muda para 5 ou 0", () => {
    expect(hungerAlertFor(4, 5)).toBe(5);
    expect(hungerAlertFor(1, 0)).toBe(0);
    expect(hungerAlertFor(5, 5)).toBeNull();
    expect(hungerAlertFor(2, 3)).toBeNull();
  });
});

describe("geração", () => {
  it("mapeia a tabela e os extremos", () => {
    expect(potencyFromGeneration("12ª")).toBe(1);
    expect(potencyFromGeneration("4ª")).toBe(5);
    expect(potencyFromGeneration("8ª")).toBe(2);
    expect(potencyFromGeneration("9ª")).toBe(2);
    expect(potencyFromGeneration("14ª")).toBe(0);
    expect(potencyFromGeneration("20")).toBe(0);
    expect(potencyFromGeneration("3ª")).toBe(5);
    expect(potencyFromGeneration("")).toBeNull();
  });
});

describe("humanidade", () => {
  it("mancha alterna e conta", () => {
    const s = sheet();
    const p = toggleStain(s, 9);
    expect(p.manchas).toBe(1);
    expect(stains({ ...s, ...p })[9]).toBe(true);
  });
  it("fichas só com contagem marcam as últimas caixas", () => {
    expect(stains(sheet({ manchas: 2 })).slice(8)).toEqual([true, true]);
  });
  it("nível limitado a 0–10", () => {
    expect(adjustHumanity(sheet({ humanidade: 10 }), 1)).toBe(10);
    expect(adjustHumanity(sheet({ humanidade: 0 }), -1)).toBe(0);
  });
});

describe("assistente", () => {
  it("atributos em 2 ao sair do passo 1", () => {
    const attrs = initialAttributes(blankSheet().attrs);
    expect(attrs?.Força).toBe(2);
    expect(initialAttributes({ ...blankSheet().attrs, Força: 3 })).toBeNull();
  });
  it("cota de 4 excedida", () => {
    const attrs = { ...blankSheet().attrs, Força: 4, Vigor: 4 };
    const { quotas, summary } = attributeQuotas(attrs);
    expect(quotas[0].state).toBe("over");
    expect(summary).toBe("Você passou de alguma cota: ajuste os pontos.");
  });
  it("progresso da distribuição Equilibrado", () => {
    const skills = { ...blankSheet().skills, Briga: 3, Etiqueta: 3 };
    const lines = skillDistributionProgress(
      sheet({ dist: "Equilibrado", skills })
    );
    expect(lines[0]).toEqual({ current: 2, done: false, level: 3, target: 3 });
  });
  describe("checagem da distribuição", () => {
    /** Preenche as habilidades na ordem de SKILLS conforme `plan` (nível → quantidade). */
    const fill = (plan: Record<number, number>) => {
      const skills = { ...blankSheet().skills };
      const names = Object.keys(skills);
      let i = 0;
      for (const [level, n] of Object.entries(plan)) {
        for (let k = 0; k < n; k += 1) {
          skills[names[i]] = Number(level);
          i += 1;
        }
      }
      return skills;
    };
    const balanced = () => fill({ 1: 7, 2: 5, 3: 3 });

    it("Equilibrado completo é válido", () => {
      const r = skillDistributionCheck({
        dist: "Equilibrado",
        skills: balanced(),
      });
      expect(r.message).toBe("");
      expect(r.stray).toEqual([]);
    });
    it("Especialista completo com 4 é válido", () => {
      const skills = fill({ 1: 3, 2: 3, 3: 3, 4: 1 });
      const r = skillDistributionCheck({ dist: "Especialista", skills });
      expect(r.message).toBe("");
    });
    it("nível incompleto diz quanto falta", () => {
      const skills = { ...blankSheet().skills, Briga: 3, Etiqueta: 3 };
      const r = skillDistributionCheck({ dist: "Equilibrado", skills });
      expect(r.message).toContain("Nível 3: falta 1.");
      expect(r.message).toContain("Nível 1: faltam 7.");
    });
    it("nível com excesso diz quanto sobra", () => {
      const skills = { ...balanced(), Tecnologia: 2 };
      const r = skillDistributionCheck({ dist: "Equilibrado", skills });
      expect(r.message).toBe("Nível 2: sobra 1.");
    });
    it("habilidade fora do formato é listada", () => {
      const skills = { ...balanced(), Tecnologia: 4 };
      const r = skillDistributionCheck({ dist: "Equilibrado", skills });
      expect(r.lines.every((l) => l.done)).toBe(true);
      expect(r.stray).toEqual([{ level: 4, name: "Tecnologia" }]);
      expect(r.message).toBe("Fora do formato: Tecnologia (4).");
    });
  });
  it("totais de méritos", () => {
    const meritos: Merit[] = [
      { nome: "Recursos", pontos: 3, tipo: "vantagem" },
      { nome: "Inimigo", pontos: 2, tipo: "defeito" },
    ];
    expect(meritTotals(meritos, "Brujah")).toEqual({
      defeitos: 2,
      defeitosSR: 0,
      qualidadesSR: 0,
      vantagens: 3,
    });
  });
  it("tipos SR contam como vantagem/defeito fora do Sangue Fraco", () => {
    const meritos: Merit[] = [
      { nome: "Olfato", pontos: 2, tipo: "qualidade-sr" },
      { nome: "Sem fôlego", pontos: 1, tipo: "defeito-sr" },
    ];
    expect(meritTotals(meritos, "Brujah")).toMatchObject({
      defeitos: 1,
      vantagens: 2,
    });
    expect(meritTotals(meritos, "Sangue Fraco")).toEqual({
      defeitos: 0,
      defeitosSR: 1,
      qualidadesSR: 1,
      vantagens: 0,
    });
    expect(effectiveMeritKind("qualidade-sr", "Brujah")).toBe("vantagem");
    expect(meritKinds("Sangue Fraco")).toHaveLength(4);
    expect(meritKinds("Brujah")).toEqual(["vantagem", "defeito"]);
  });
  describe("meritStatus", () => {
    it("aponta o que falta", () => {
      const r = meritStatus(
        [
          { nome: "Recursos", pontos: 3, tipo: "vantagem" },
          { nome: "Inimigo", pontos: 3, tipo: "defeito" },
        ],
        "Brujah"
      );
      expect(r.ok).toBe(false);
      expect(r.message).toBe(
        "Falta: distribuir 4 pts em vantagens · remover 1 pts de defeitos."
      );
    });
    it("completa com 7 e 2", () => {
      const r = meritStatus(
        [
          { nome: "Recursos", pontos: 4, tipo: "vantagem" },
          { nome: "Contatos", pontos: 3, tipo: "vantagem" },
          { nome: "Inimigo", pontos: 2, tipo: "defeito" },
        ],
        "Brujah"
      );
      expect(r).toMatchObject({ message: "Distribuição completa.", ok: true });
    });
    it("Sangue Fraco exige Qualidades e Defeitos SR", () => {
      const base: Merit[] = [
        { nome: "Recursos", pontos: 5, tipo: "vantagem" },
        { nome: "Contatos", pontos: 2, tipo: "vantagem" },
        { nome: "Inimigo", pontos: 2, tipo: "defeito" },
      ];
      expect(meritStatus(base, "Sangue Fraco").message).toBe(
        "Falta: ter de 1 a 3 Qualidades de Sangue-Ralo."
      );
      const one: Merit[] = [
        ...base,
        { nome: "Olfato", pontos: 1, tipo: "qualidade-sr" },
      ];
      expect(meritStatus(one, "Sangue Fraco").message).toBe(
        "Falta: igualar Defeitos de Sangue-Ralo às Qualidades."
      );
      expect(
        meritStatus(
          [...one, { nome: "Sem fôlego", pontos: 1, tipo: "defeito-sr" }],
          "Sangue Fraco"
        ).ok
      ).toBe(true);
    });
  });
  describe("clanDisciplineOptions", () => {
    it("clã comum lista só as do clã", () => {
      const r = clanDisciplineOptions("Brujah");
      expect(r.kind).toBe("clan");
      expect(r.options).toEqual(["Celeridade", "Potência", "Presença"]);
      expect(r.aviso).toBe(
        "Escolha duas Disciplinas do clã Brujah (Celeridade, Potência, Presença). Dois pontos em uma, um ponto na outra."
      );
    });
    it("Caitiff escolhe qualquer uma", () => {
      const r = clanDisciplineOptions("Caitiff");
      expect(r.kind).toBe("free");
      expect(r.options).toEqual(DISCIPLINES);
    });
    it("Sangue Fraco não tem", () => {
      expect(clanDisciplineOptions("Sangue Fraco")).toMatchObject({
        kind: "thin",
        options: [],
      });
    });
    it("sem clã pede o passo 1", () => {
      expect(clanDisciplineOptions("").kind).toBe("none");
    });
  });
  describe("disciplineDistribution", () => {
    it("2 e 1 completa", () => {
      const r = disciplineDistribution(
        [
          { nivel: 1, nome: "Potência" },
          { nivel: 2, nome: "Presença" },
        ],
        "Brujah"
      );
      expect(r).toMatchObject({
        message: "Distribuição completa: 2 e 1.",
        ok: true,
      });
    });
    it("lista o que falta", () => {
      const r = disciplineDistribution(
        [
          { nivel: 1, nome: "Potência" },
          { nivel: 1, nome: "" },
        ],
        "Brujah"
      );
      expect(r.message).toBe(
        "Falta: escolher as duas Disciplinas e marcar 2 pontos em uma e 1 na outra."
      );
    });
    it("Sangue Fraco sempre ok", () => {
      expect(disciplineDistribution([], "Sangue Fraco").ok).toBe(true);
    });
  });
});

describe("poderes por ponto", () => {
  const pw = (nome: string, nivel: number): Power => ({
    custo: "",
    desc: "",
    duracao: "",
    nivel,
    nome,
    rouse: false,
  });

  it("dica com contador", () => {
    expect(powerLimitHint(2, 1)).toBe(
      "Escolha 2 poderes (um por ponto) · 1/2 escolhidos. Toque no nome para ver a descrição."
    );
    expect(powerLimitHint(1, 0)).toContain("Escolha 1 poder (um por ponto)");
    expect(powerLimitHint(0, 0)).toBe(
      "Marque os pontos primeiro: cada ponto dá direito a um poder. Toque no nome para ver a descrição."
    );
  });

  it("bloqueia sem pontos e acima do limite", () => {
    expect(powerToggleBlock("Domínio", 0, 0)?.titulo).toBe("Sem pontos");
    expect(powerToggleBlock("Presença", 1, 1)).toEqual({
      msg: "Presença tem 1 ponto: só 1 poder. Tire um para trocar.",
      titulo: "Limite de poderes",
    });
    expect(powerToggleBlock("Domínio", 2, 2)?.msg).toBe(
      "Domínio tem 2 pontos: só 2 poderes. Tire um para trocar."
    );
    expect(powerToggleBlock("Domínio", 2, 1)).toBeNull();
  });

  it("corta poderes ao baixar o nível", () => {
    const powers = [pw("B", 2), pw("A", 1)];
    expect(trimPowers(powers, 1).map((p) => p.nome)).toEqual(["A"]);
    expect(trimPowers(powers, 2).map((p) => p.nome)).toEqual(["A", "B"]);
    expect(trimPowers([pw("A", 1), pw("C", 1)], 1).map((p) => p.nome)).toEqual([
      "A",
    ]);
  });
});

describe("notas da geração", () => {
  it("nota da Potência", () => {
    expect(potencyNote({ geracao: "9ª", potencia: 0 })).toBe(
      "Geração 9ª — Potência de Sangue 2."
    );
    expect(potencyNote({ geracao: "", potencia: 0 })).toBe(
      "Escolha a Geração para definir a Potência de Sangue."
    );
  });

  it("geração do senhor", () => {
    expect(sireNote("9ª")).toBe(
      "Seu senhor é da 8ª Geração (você é sempre uma Geração acima do senhor)."
    );
    expect(sireNote("")).toBe("Você é sempre uma Geração acima do seu senhor.");
  });
});

describe("especialidades", () => {
  it("junta as do assistente sem vazios", () => {
    expect(
      specialtiesBySkill(
        sheet({
          espec: { Briga: [" "], Persuasão: ["Negociação", "", "Sedução"] },
        })
      )
    ).toEqual({ Persuasão: ["Negociação", "Sedução"] });
  });

  it("acrescenta a do Predador", () => {
    expect(
      specialtiesBySkill(sheet({ predEspec: "Intimidação (Chantagem)" }))
    ).toEqual({ Intimidação: ["Chantagem"] });
  });

  it("não repete a do Predador", () => {
    expect(
      specialtiesBySkill(
        sheet({
          espec: { Persuasão: ["Seduzir"] },
          predEspec: "Persuasão (Seduzir)",
        })
      )
    ).toEqual({ Persuasão: ["Seduzir"] });
  });

  it("ignora Predador fora do formato", () => {
    expect(specialtiesBySkill(sheet({ predEspec: "Chantagem" }))).toEqual({});
  });
});
