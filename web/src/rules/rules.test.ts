import { describe, expect, it } from "vitest";
import { DISCIPLINES, POWERS } from "#/data/disciplines";
import { findMerit } from "#/data/merits";
import { findPredator, PREDATORS, type Predator } from "#/data/predators";
import { SKILLS } from "#/data/traits";
import { blankSheet } from "#/lib/sheet";
import type { DamageMark, Merit, Power, Sheet } from "#/lib/types";
import { bloodSurgeNote, healAggravated, rouseCheck, sleep } from "./actions";
import { nextDotValue } from "./dots";
import { FEEDING_SOURCES, feed, feedingYield } from "./feeding";
import {
  bloodPotency,
  potencyFromGeneration,
  potencyNote,
  sireNote,
} from "./generation";
import { adjustHumanity, stains, toggleStain } from "./humanity";
import { hungerAlertFor } from "./hunger";
import {
  applyPredator,
  disciplineBlock,
  predatorBlock,
  predatorChoiceStatus,
  predatorDiscipline,
  predatorMerits,
  predatorPower,
  removePredator,
} from "./predator";
import {
  predatorSpecialty,
  specialtiesBySkill,
  splitPredatorSpecialty,
} from "./specialties";
import { addDamage, cycleBox, trackBoxes, vitalityMax } from "./tracks";
import {
  attributeQuotas,
  clanDisciplineOptions,
  disciplineDistribution,
  effectiveMeritKind,
  initialAttributes,
  keepClanDisciplines,
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

describe("Checagem de sangue", () => {
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
  it("sem distribuição, o progresso usa Faz-tudo", () => {
    const lines = skillDistributionProgress(sheet());
    expect(lines.map((l) => [l.level, l.target])).toEqual([
      [3, 1],
      [2, 8],
      [1, 10],
    ]);
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
  describe("keepClanDisciplines", () => {
    const d = (nome: string, nivel: number) => ({
      nivel,
      nome,
      powers: [{ nivel: 1, nome: "x" }] as Power[],
    });
    const empty = { nivel: 0, nome: "", powers: [] };

    it("Brujah → Ventrue limpa as duas", () => {
      expect(
        keepClanDisciplines([d("Potência", 2), d("Celeridade", 1)], "Ventrue")
      ).toEqual([empty, empty]);
    });

    it("mantém a Disciplina compartilhada com o novo clã", () => {
      const presenca = d("Presença", 2);
      expect(
        keepClanDisciplines([presenca, d("Potência", 1)], "Toreador")
      ).toEqual([presenca, empty]);
    });

    it("Caitiff mantém tudo e slots vazios seguem vazios", () => {
      const disc = [d("Potência", 2), empty];
      expect(keepClanDisciplines(disc, "Caitiff")).toEqual(disc);
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
  const e = (nome: string) => ({ nome });

  it("junta as do assistente sem vazios", () => {
    expect(
      specialtiesBySkill(
        sheet({
          espec: { Briga: [" "], Persuasão: ["Negociação", "", "Sedução"] },
        })
      )
    ).toEqual({ Persuasão: [e("Negociação"), e("Sedução")] });
  });

  it("acrescenta a do Predador com o nome sugerido em fichas antigas", () => {
    expect(
      specialtiesBySkill(sheet({ predEspec: "Intimidação (Chantagem)" }))
    ).toEqual({ Intimidação: [e("Chantagem")] });
  });

  it("usa o nome da do Predador definido no passo 6", () => {
    expect(
      specialtiesBySkill(
        sheet({
          predEspec: "Intimidação (Chantagem)",
          predEspecNome: "Extorsão",
        })
      )
    ).toEqual({ Intimidação: [e("Extorsão")] });
  });

  it("não repete a do Predador", () => {
    expect(
      specialtiesBySkill(
        sheet({
          espec: { Persuasão: ["Seduzir"] },
          predEspec: "Persuasão (Seduzir)",
        })
      )
    ).toEqual({ Persuasão: [e("Seduzir")] });
  });

  it("ignora Predador fora do formato", () => {
    expect(specialtiesBySkill(sheet({ predEspec: "Chantagem" }))).toEqual({});
  });

  it("separa habilidade e nome sugerido da do Predador", () => {
    expect(splitPredatorSpecialty("Ofícios (Armadilhas)")).toEqual({
      nome: "Armadilhas",
      skill: "Ofícios",
    });
    expect(splitPredatorSpecialty("Armadilhas")).toBeNull();
    expect(splitPredatorSpecialty(undefined)).toBeNull();
  });

  it("nome em branco cai no sugerido", () => {
    expect(
      predatorSpecialty(
        sheet({ predEspec: "Intimidação (Chantagem)", predEspecNome: "  " })
      )
    ).toEqual({ nome: "Chantagem", skill: "Intimidação" });
  });
});

describe("Predador", () => {
  const pred = (name: string): Predator => {
    const p = findPredator(name);
    if (!p) {
      throw new Error(name);
    }
    return p;
  };
  const brujah = (over: Partial<Sheet> = {}) =>
    sheet({
      cla: "Brujah",
      disc: [
        { nivel: 2, nome: "Potência", powers: [] },
        { nivel: 1, nome: "Celeridade", powers: [] },
      ],
      geracao: "12ª",
      humanidade: 7,
      meritos: [{ nome: "Recursos", pontos: 3, tipo: "vantagem" }],
      ...over,
    });

  it("status das escolhas", () => {
    expect(predatorChoiceStatus(pred("Sereia"), {})).toEqual([]);
    expect(predatorChoiceStatus(pred("Sanguessuga"), {})).toEqual([
      {
        id: "segredo-evitado",
        message:
          "Escolha uma opção: Defeito Segredo Obscuro •• (diablerista) ou Evitado ••",
      },
    ]);
    expect(
      predatorChoiceStatus(pred("Sanguessuga"), {
        "segredo-evitado": { Evitado: 2 },
      })
    ).toEqual([]);
    const osiris = pred("Osíris");
    expect(
      predatorChoiceStatus(osiris, {
        "inimigo-mitico": { Inimigo: 2 },
        "rebanho-fama": { Fama: 1, Rebanho: 1 },
      })
    ).toEqual([
      {
        id: "rebanho-fama",
        message: "Distribua 3 pontos entre Rebanho e Fama",
      },
    ]);
    expect(
      predatorChoiceStatus(osiris, {
        "inimigo-mitico": { "Defeito Mítico": 1, Inimigo: 1 },
        "rebanho-fama": { Fama: 1, Rebanho: 2 },
      })
    ).toEqual([]);
  });

  it("méritos fixos e escolhidos", () => {
    expect(predatorMerits(pred("Sereia"), {})).toEqual([
      { nome: "Bonito", origem: "predador", pontos: 2, tipo: "vantagem" },
      {
        nome: "Inimigo (amante desprezado ou parceiro ciumento)",
        origem: "predador",
        pontos: 1,
        tipo: "defeito",
      },
    ]);
    expect(
      predatorMerits(pred("Osíris"), {
        "inimigo-mitico": { "Defeito Mítico": 0, Inimigo: 2 },
        "rebanho-fama": { Fama: 1, Rebanho: 2 },
      })
    ).toEqual([
      { nome: "Rebanho", origem: "predador", pontos: 2, tipo: "vantagem" },
      { nome: "Fama", origem: "predador", pontos: 1, tipo: "vantagem" },
      { nome: "Inimigo", origem: "predador", pontos: 2, tipo: "defeito" },
    ]);
  });

  it("méritos de mesmo nome e tipo somam", () => {
    expect(
      predatorMerits(pred("Alçapão"), {
        "lacaios-rebanho-refugio": { Refúgio: 1 },
        "refugio-defeito": { "Refúgio Assustador": 1 },
      })
    ).toEqual([
      { nome: "Refúgio", origem: "predador", pontos: 2, tipo: "vantagem" },
      {
        nome: "Refúgio Assustador",
        origem: "predador",
        pontos: 1,
        tipo: "defeito",
      },
    ]);
  });

  it("catálogo tem os 16 tipos do Livro Básico e do Players Guide", () => {
    expect(PREDATORS.map((p) => p.name)).toEqual([
      "Gato de Rua",
      "Extorsionário",
      "Sereia",
      "Saqueador",
      "Sanguessuga",
      "Doméstico",
      "Consensualista",
      "Fazendeiro",
      "Osíris",
      "João Pestana",
      "Rainha da Cena",
      "Ladrão de Túmulos",
      "Ceifador",
      "Montero",
      "Perseguidor",
      "Alçapão",
    ]);
  });

  it("especialidades, Disciplinas e méritos batem com os catálogos", () => {
    // méritos que só o Predador usa e ainda não estão em data/merits.ts
    const fora = new Set([
      "Sabujo de Sangue",
      "Predador Óbvio",
      "Refúgio Assustador",
      "Refúgio Assombrado",
      "Rejeitado",
      "Defeito Mítico",
    ]);
    for (const p of PREDATORS) {
      for (const spec of p.specialties) {
        expect(SKILLS, `${p.name}: ${spec}`).toContain(
          splitPredatorSpecialty(spec)?.skill
        );
      }
      expect(p.disciplines).toHaveLength(2);
      for (const d of p.disciplines) {
        expect(DISCIPLINES, `${p.name}: ${d.nome}`).toContain(
          d.nome === "Proteanismo" ? "Protean" : d.nome
        );
        expect(POWERS[d.nome]?.length, `${p.name}: ${d.nome}`).toBeGreaterThan(
          0
        );
      }
      const nomes = p.adjustments.flatMap((a) => {
        if (a.kind === "merito") {
          return [a.nome];
        }
        return a.kind === "escolha" ? a.opcoes.map((o) => o.nome) : [];
      });
      for (const nome of nomes) {
        expect(
          fora.has(nome) || Boolean(findMerit(nome)),
          `${p.name}: ${nome}`
        ).toBe(true);
      }
    }
  });

  it("Predador vetado por clã e Potência de Sangue", () => {
    const ventrue = { cla: "Ventrue", geracao: "12ª" };
    expect(predatorBlock(pred("Fazendeiro"), ventrue)).toBe(
      "Ventrue não pode ser Fazendeiro"
    );
    expect(predatorBlock(pred("Saqueador"), ventrue)).toBe(
      "Ventrue não pode ser Saqueador"
    );
    expect(predatorBlock(pred("Sereia"), ventrue)).toBeNull();
    expect(
      predatorBlock(pred("Fazendeiro"), { cla: "Brujah", geracao: "7ª" })
    ).toBe("Exige Potência de Sangue 2 ou menos");
    expect(
      predatorBlock(pred("Fazendeiro"), { cla: "Brujah", geracao: "9ª" })
    ).toBeNull();
    for (const p of PREDATORS) {
      expect(predatorBlock(p, { cla: "Brujah", geracao: "12ª" })).toBeNull();
    }
  });

  it("Feitiçaria de Sangue só para Tremere e Banu Haqim", () => {
    for (const name of ["Saqueador", "Osíris"]) {
      const [feiticaria, outra] = pred(name).disciplines;
      expect(feiticaria.nome).toBe("Feitiçaria de Sangue");
      expect(disciplineBlock(feiticaria, "Brujah")).toBe(
        "só Tremere e Banu Haqim"
      );
      expect(disciplineBlock(feiticaria, "Tremere")).toBeNull();
      expect(disciplineBlock(feiticaria, "Banu Haqim")).toBeNull();
      expect(disciplineBlock(outra, "Brujah")).toBeNull();
    }
  });

  it("ponto em Disciplina existente e Humanidade", () => {
    const s = applyPredator(
      brujah({ predador: "Gato de Rua", predDisc: "Potência" })
    );
    expect(s.disc.map((d) => [d.nome, d.nivel])).toEqual([
      ["Potência", 3],
      ["Celeridade", 1],
    ]);
    expect(s.humanidade).toBe(6);
    expect(s.meritos?.map((m) => m.nome)).toEqual([
      "Recursos",
      "Contatos (criminosos)",
    ]);
    expect(s.predBonus).toEqual({
      disciplina: "Potência",
      humanidade: -1,
      novaDisciplina: false,
      potencia: 0,
    });
  });

  it("Disciplina nova entra com 1 ponto", () => {
    const s = applyPredator(
      brujah({ predador: "Sereia", predDisc: "Fortitude" })
    );
    expect(s.disc.at(-1)).toEqual({ nivel: 1, nome: "Fortitude", powers: [] });
    expect(s.predBonus?.novaDisciplina).toBe(true);
  });

  it("Humanidade limitada e delta real", () => {
    const up = applyPredator(
      brujah({ humanidade: 10, predador: "Fazendeiro", predDisc: "Animalismo" })
    );
    expect(up.humanidade).toBe(10);
    expect(up.predBonus?.humanidade).toBe(0);
    expect(removePredator(up).humanidade).toBe(10);
    expect(
      applyPredator(brujah({ predador: "Fazendeiro", predDisc: "Animalismo" }))
        .humanidade
    ).toBe(8);
  });

  it("Sanguessuga soma Potência de Sangue", () => {
    const s = applyPredator(
      brujah({
        predador: "Sanguessuga",
        predDisc: "Celeridade",
        predEscolhas: { "segredo-evitado": { Evitado: 2 } },
      })
    );
    expect(bloodPotency(s)).toBe(2);
    expect(potencyNote(s)).toBe(
      "Geração 12ª — Potência de Sangue 2. (+1 do Predador)"
    );
    expect(s.meritos?.map((m) => m.nome)).toContain("Evitado");
  });

  it("não aplica duas vezes", () => {
    const once = applyPredator(
      brujah({ predador: "Gato de Rua", predDisc: "Potência" })
    );
    expect(applyPredator(once)).toBe(once);
  });

  it("Sangue Fraco e ficha sem Predador ficam iguais", () => {
    const ralo = brujah({
      cla: "Sangue Fraco",
      predador: "Sereia",
      predDisc: "Presença",
    });
    expect(applyPredator(ralo)).toBe(ralo);
    const none = brujah();
    expect(applyPredator(none)).toBe(none);
    expect(removePredator(none)).toBe(none);
  });

  it("remover desfaz o que foi aplicado", () => {
    for (const [predador, predDisc] of [
      ["Gato de Rua", "Potência"],
      ["Sereia", "Fortitude"],
    ]) {
      const base = brujah({ predador, predDisc });
      const back = removePredator(applyPredator(base));
      expect(back.disc).toEqual(base.disc);
      expect(back.humanidade).toBe(base.humanidade);
      expect(back.meritos).toEqual(base.meritos);
      expect(back.predBonus).toBeUndefined();
    }
  });

  describe("predatorDiscipline", () => {
    const names = (ctx: ReturnType<typeof predatorDiscipline>) =>
      ctx.elegiveis.map((p) => `${p.level}:${p.name}`);
    const compelir: Power = { nivel: 1, nome: "Compelir" };
    const ventrue = [
      { nivel: 2, nome: "Domínio", powers: [compelir] },
      { nivel: 1, nome: "Presença", powers: [] },
    ];

    it("do clã com pontos vai ao próximo nível sem repetir poderes", () => {
      const ctx = predatorDiscipline("Ventrue", ventrue, "Domínio");
      expect(ctx).toMatchObject({ atual: 2, doCla: true, novo: 3 });
      expect(ctx.elegiveis.every((p) => p.level <= 3)).toBe(true);
      expect(ctx.elegiveis.some((p) => p.level === 3)).toBe(true);
      expect(names(ctx)).not.toContain("1:Compelir");
      const levels = ctx.elegiveis.map((p) => p.level);
      expect(levels).toEqual([...levels].sort());
    });

    it("fora do clã entra no nível 1", () => {
      const ctx = predatorDiscipline("Ventrue", ventrue, "Potência");
      expect(ctx).toMatchObject({ atual: 0, doCla: false, novo: 1 });
      expect(names(ctx)).toEqual(
        expect.arrayContaining(["1:Toque Letal", "1:Força Prodigiosa"])
      );
      expect(ctx.elegiveis.every((p) => p.level === 1)).toBe(true);
    });

    it("do clã sem pontos no passo 5", () => {
      const ctx = predatorDiscipline("Brujah", ventrue, "Potência");
      expect(ctx).toMatchObject({ atual: 0, doCla: true, novo: 1 });
    });

    it("Caitiff: do clã só se escolhida no passo 5", () => {
      const disc = [{ nivel: 2, nome: "Potência", powers: [] }];
      expect(predatorDiscipline("Caitiff", disc, "Potência").doCla).toBe(true);
      expect(predatorDiscipline("Caitiff", disc, "Domínio").doCla).toBe(false);
    });

    it("sem catálogo não tem elegíveis", () => {
      expect(
        predatorDiscipline("Ventrue", ventrue, "Fascinação").elegiveis
      ).toEqual([]);
    });

    it("poder escolhido só vale se for elegível", () => {
      const ctx = predatorDiscipline("Ventrue", ventrue, "Potência");
      expect(predatorPower(ctx, "Toque Letal")?.name).toBe("Toque Letal");
      expect(predatorPower(ctx, "Compelir")).toBeUndefined();
      expect(predatorPower(ctx, "")).toBeUndefined();
    });
  });

  it("poder do Predador entra com o ponto e sai ao remover", () => {
    const base = brujah({
      predador: "Gato de Rua",
      predDisc: "Potência",
      predPoder: "Força Prodigiosa",
    });
    const s = applyPredator(base);
    expect(s.disc[0].nivel).toBe(3);
    expect(s.disc[0].powers.map((p) => p.nome)).toEqual(["Força Prodigiosa"]);
    expect(s.predBonus?.poder).toBe("Força Prodigiosa");
    expect(removePredator(s).disc).toEqual(base.disc);
  });

  it("poder numa Disciplina nova", () => {
    const s = applyPredator(
      brujah({
        cla: "Ventrue",
        predador: "Extorsionário",
        predDisc: "Dominação",
        predPoder: "Compelir",
      })
    );
    expect(s.disc.at(-1)).toMatchObject({
      nivel: 1,
      nome: "Dominação",
      powers: [{ nivel: 1, nome: "Compelir" }],
    });
  });

  it("remover tira uma só cópia do poder", () => {
    const applied = applyPredator(
      brujah({
        predador: "Gato de Rua",
        predDisc: "Potência",
        predPoder: "Força Prodigiosa",
      })
    );
    const copy = { nivel: 1, nome: "Força Prodigiosa" };
    const manual = {
      ...applied,
      disc: applied.disc.map((d, i) =>
        i === 0 ? { ...d, powers: [...d.powers, copy] } : d
      ),
    };
    expect(removePredator(manual).disc[0].powers).toEqual([copy]);
  });

  it("linhas do Predador fora da cota 7/2", () => {
    const meritos: Merit[] = [
      { nome: "Recursos", pontos: 7, tipo: "vantagem" },
      { nome: "Inimigo", pontos: 2, tipo: "defeito" },
      { nome: "Bonito", origem: "predador", pontos: 2, tipo: "vantagem" },
    ];
    expect(meritTotals(meritos, "Brujah")).toMatchObject({
      defeitos: 2,
      vantagens: 7,
    });
  });
});
