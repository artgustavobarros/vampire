import { describe, expect, it } from "vitest";
import { findClan } from "#/data/clans";
import { exampleSheet } from "#/data/example-sheet";
import { findPredator } from "#/data/predators";
import { potencyFromGeneration } from "#/rules/generation";
import { blankSheet, normalizeSheet } from "./sheet";

describe("normalizeSheet", () => {
  it("completa campos ausentes com os padrões", () => {
    const s = normalizeSheet({ attrs: { Força: 3 }, nome: "Ana" });
    expect(s.nome).toBe("Ana");
    expect(s.attrs.Força).toBe(3);
    expect(s.attrs.Vigor).toBe(1);
    expect(s.skills.Briga).toBe(0);
    expect(s.fome).toBe(1);
    expect(s.conv).toHaveLength(3);
  });

  it("descarta disciplinas sem nome", () => {
    const s = normalizeSheet({
      disc: [
        { nivel: 1, nome: "  " },
        { nivel: 2, nome: "Presença" },
      ],
    });
    expect(s.disc).toEqual([{ nivel: 2, nome: "Presença", powers: [] }]);
  });

  it("trata null como campo ausente", () => {
    const s = normalizeSheet({ fome: null, nome: "Ana", predBonus: null });
    expect(s.fome).toBe(1);
    expect(s.nome).toBe("Ana");
    expect("predBonus" in s).toBe(false);
  });

  it("devolve ficha em branco para lixo", () => {
    expect(normalizeSheet("x")).toEqual(blankSheet());
    expect(normalizeSheet(null)).toEqual(blankSheet());
  });
});

describe("ficha de exemplo", () => {
  it("usa nomes do catálogo e abre o assistente", () => {
    const s = exampleSheet();
    expect(s.nome).toBe("Vitória Salles");
    expect(s.criada).toBe(false);
    expect(findClan(s.cla)?.name).toBe("Ventrue");
    expect(findPredator(s.predador)?.name).toBe("Extorsionário");
    expect(potencyFromGeneration(s.geracao)).toBe(1);
  });
});
