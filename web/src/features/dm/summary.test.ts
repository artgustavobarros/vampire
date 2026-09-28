import { describe, expect, it } from "vitest";
import { blankSheet } from "#/lib/sheet";
import { summarize, trackSummary } from "./summary";

describe("resumo do cartão", () => {
  it("conta superficial e agravado como caixas perdidas", () => {
    expect(trackSummary([1, 2, 0], 6)).toEqual({ atual: 4, max: 6 });
    expect(trackSummary(undefined, 5)).toEqual({ atual: 5, max: 5 });
  });

  it("resume a ficha criada", () => {
    const sheet = {
      ...blankSheet(),
      attrs: {
        ...blankSheet().attrs,
        Autocontrole: 2,
        Determinação: 3,
        Vigor: 2,
      },
      cla: "Ventrue",
      criada: true,
      fdv: [2, 0, 0, 0, 0] as const,
      fome: 1,
      nome: "Vitória Salles",
    };
    expect(summarize(sheet)).toEqual({
      cla: "Ventrue",
      fdv: { atual: 4, max: 5 },
      fome: 1,
      nome: "Vitória Salles",
      vit: { atual: 5, max: 5 },
    });
  });

  it("sem ficha ou em criação não tem resumo", () => {
    expect(summarize(null)).toBeNull();
    expect(summarize({ ...blankSheet(), nome: "Rascunho" })).toBeNull();
  });
});
