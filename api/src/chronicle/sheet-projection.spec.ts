import { describe, expect, it } from "vitest";
import { projectSheet } from "./sheet-projection.js";

describe("projectSheet", () => {
  it("devolve só o que o cartão mostra", () => {
    const sheet = {
      attrs: { Autocontrole: 3, Determinação: 2, Força: 4, Vigor: 2 },
      cla: "Ventrue",
      criada: true,
      disciplinas: [{ nome: "Dominação" }],
      fdv: [0, 1],
      fome: 1,
      nome: "Vitória Salles",
      notas: "segredo",
      skills: { Briga: 2 },
      vit: [2],
    };
    expect(projectSheet(sheet)).toEqual({
      attrs: { Autocontrole: 3, Determinação: 2, Vigor: 2 },
      cla: "Ventrue",
      criada: true,
      fdv: [0, 1],
      fome: 1,
      nome: "Vitória Salles",
      vit: [2],
    });
  });

  it("ficha ausente vira null e attrs ausente vira vazio", () => {
    expect(projectSheet(null)).toBeNull();
    expect(projectSheet({ nome: "X" })).toEqual({ attrs: {}, nome: "X" });
  });
});
