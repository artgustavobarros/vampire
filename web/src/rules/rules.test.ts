import { describe, expect, it } from "vitest";
import { blankSheet } from "#/lib/sheet";
import type { DamageMark, Sheet } from "#/lib/types";
import { bloodSurgeNote, healAggravated, rouseCheck, sleep } from "./actions";
import { nextDotValue } from "./dots";
import { FEEDING_SOURCES, feed, feedingYield } from "./feeding";
import { potencyFromGeneration } from "./generation";
import { adjustHumanity, stains, toggleStain } from "./humanity";
import { hungerAlertFor } from "./hunger";
import { addDamage, cycleBox, trackBoxes, vitalityMax } from "./tracks";
import {
  attributeQuotas,
  initialAttributes,
  meritTotals,
  skillDistributionProgress,
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
      "Surto de Sangue: +2 dados no teste."
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
    expect(potencyFromGeneration("8ª")).toBe(3);
    expect(potencyFromGeneration("20")).toBe(0);
    expect(potencyFromGeneration("3ª")).toBe(7);
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
  it("totais de méritos", () => {
    const s = sheet({
      meritos: [
        { nome: "Recursos", pontos: 3, tipo: "vantagem" },
        { nome: "Inimigo", pontos: 2, tipo: "defeito" },
      ],
    });
    expect(meritTotals(s)).toEqual({ defeitos: 2, vantagens: 3 });
  });
});
