import { describe, expect, it } from "vitest";
import {
  type Die,
  diceLine,
  RANDOM,
  rollResonance,
  thinBloodPowers,
} from "./resonance";

/** Dados viciados: devolvem os valores na ordem e conferem as faces. */
function dice(...rolls: [faces: number, value: number][]): Die {
  const queue = [...rolls];
  return (faces) => {
    const next = queue.shift();
    if (!next) {
      throw new Error(`d${faces} a mais`);
    }
    expect(faces).toBe(next[0]);
    return next[1];
  };
}

const ALL_RANDOM = {
  intensidade: RANDOM,
  sangueFraco: false,
  tipo: RANDOM,
} as const;

describe("rolagem de Ressonância", () => {
  it("tudo aleatório sem segundo dado", () => {
    const roll = rollResonance(ALL_RANDOM, dice([10, 5], [10, 7]));
    expect(roll).toMatchObject({
      discrasia: null,
      intensidade: "Difusa",
      tipo: "Melancólica",
    });
    expect(diceLine(roll)).toBe("Ressonância d10: 5 · Intensidade d10: 7");
  });

  it("9 e 10 na intensidade dão Aguçada com discrasia em d3", () => {
    const roll = rollResonance(
      ALL_RANDOM,
      dice([10, 2], [10, 9], [10, 10], [3, 2])
    );
    expect(roll.tipo).toBe("Fleumática");
    expect(roll.intensidade).toBe("Aguçada");
    expect(roll.discrasia?.nome).toBe("Apatia");
    expect(diceLine(roll)).toBe(
      "Ressonância d10: 2 · Intensidade d10: 9, 10 · Discrasia d3: 2"
    );
  });

  it("segundo dado baixo dá Intensa, sem discrasia", () => {
    const roll = rollResonance(ALL_RANDOM, dice([10, 1], [10, 9], [10, 3]));
    expect(roll.intensidade).toBe("Intensa");
    expect(roll.discrasia).toBeNull();
    expect(diceLine(roll)).toBe("Ressonância d10: 1 · Intensidade d10: 9, 3");
  });

  it("10 e 4 dão Intensa", () => {
    const roll = rollResonance(
      { intensidade: RANDOM, sangueFraco: false, tipo: "Sanguínea" },
      dice([10, 10], [10, 4])
    );
    expect(roll.intensidade).toBe("Intensa");
  });

  it("tudo fixo em Aguçada só rola a discrasia", () => {
    const roll = rollResonance(
      { intensidade: "Aguçada", sangueFraco: false, tipo: "Fleumática" },
      dice([3, 1])
    );
    expect(roll.discrasia).toEqual({
      descricao: "Calma absoluta, quase clínica, diante de qualquer coisa.",
      nome: "Frieza",
    });
    expect(diceLine(roll)).toBe(
      "Discrasia d3: 1 · Fleumática (escolhida) · Aguçada (escolhida)"
    );
  });

  it("tabela do d10 de ressonância", () => {
    const moodFor = (n: number) =>
      rollResonance(
        { intensidade: "Difusa", sangueFraco: false, tipo: RANDOM },
        dice([10, n])
      ).tipo;
    expect([1, 3, 4, 6, 7, 8, 9, 10].map(moodFor)).toEqual([
      "Fleumática",
      "Fleumática",
      "Melancólica",
      "Melancólica",
      "Colérica",
      "Colérica",
      "Sanguínea",
      "Sanguínea",
    ]);
  });

  it("negligenciável com colérica", () => {
    const roll = rollResonance(ALL_RANDOM, dice([10, 8], [10, 3]));
    expect(roll).toMatchObject({
      discrasia: null,
      intensidade: "Negligenciável",
      tipo: "Colérica",
    });
    expect(diceLine(roll)).toBe("Ressonância d10: 8 · Intensidade d10: 3");
  });

  it("sangue-fraco em Intensa rola Disciplina e poder de nível 1", () => {
    const roll = rollResonance(
      { intensidade: "Intensa", sangueFraco: true, tipo: "Fleumática" },
      dice([2, 1], [2, 2])
    );
    expect(roll.discrasia).toBeNull();
    expect(roll.poder).toMatchObject({ disciplina: "Auspícios", nivel: 1 });
    expect(roll.poder?.poder.name).toBe("Sentir o Invisível");
    expect(diceLine(roll)).toBe(
      "Disciplina d2: 1 · Poder d2: 2 · Fleumática (escolhida) · Intensa (escolhida)"
    );
  });

  it("sangue-fraco em Aguçada rola discrasia e poder de nível 2", () => {
    const roll = rollResonance(
      { intensidade: "Aguçada", sangueFraco: true, tipo: RANDOM },
      dice([10, 3], [3, 1], [2, 1])
    );
    expect(roll.discrasia?.nome).toBe("Frieza");
    // Auspícios tem um só poder de nível 2: sai sem dado
    expect(roll.poder).toMatchObject({ disciplina: "Auspícios", nivel: 2 });
    expect(roll.poder?.poder.name).toBe("Premonição");
    expect(diceLine(roll)).toBe(
      "Ressonância d10: 3 · Discrasia d3: 1 · Disciplina d2: 1 · Aguçada (escolhida)"
    );
  });

  it("sangue-fraco em Difusa não ganha poder", () => {
    const roll = rollResonance(
      { intensidade: "Difusa", sangueFraco: true, tipo: "Colérica" },
      dice()
    );
    expect(roll.poder).toBeNull();
  });

  it("sem sangue-fraco, Intensa não rola poder", () => {
    const roll = rollResonance(
      { intensidade: "Intensa", sangueFraco: false, tipo: "Colérica" },
      dice()
    );
    expect(roll.poder).toBeNull();
  });

  it("poderes de sangue-fraco deixam de fora rituais, amálgamas e apelidos", () => {
    const nomes = (disc: string, nivel: number) =>
      thinBloodPowers(disc, nivel).map((p) => p.name);
    expect(nomes("Potência", 1)).toEqual(["Corpo Letal", "Salto Elevado"]);
    expect(nomes("Dominação", 2)).toEqual(["Mesmerizar"]);
    expect(nomes("Feitiçaria de Sangue", 1)).not.toContain(
      "Criar Pedra de Sangue"
    );
    for (const nivel of [1, 2]) {
      for (const disc of [
        "Celeridade",
        "Potência",
        "Fortitude",
        "Oblívio",
        "Auspícios",
        "Dominação",
        "Feitiçaria de Sangue",
        "Presença",
      ]) {
        expect(nomes(disc, nivel).length).toBeGreaterThan(0);
      }
    }
  });
});
