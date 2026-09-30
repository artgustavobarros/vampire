import { describe, expect, it } from "vitest";
import { compulsionDiceLine, rollCompulsion } from "./compulsion";
import type { Die } from "./resonance";

/** Dados viciados que devolvem os valores na ordem. */
function dice(...values: number[]): Die {
  const queue = [...values];
  return () => queue.shift() ?? 1;
}

describe("rollCompulsion", () => {
  it.each([
    [1, "Fome"],
    [3, "Fome"],
    [4, "Dominância"],
    [5, "Dominância"],
    [6, "Dano"],
    [7, "Dano"],
    [8, "Paranoia"],
    [9, "Paranoia"],
  ])("d10 %i é %s", (n, tipo) => {
    expect(rollCompulsion(null, dice(n))).toEqual({ dados: [n], tipo });
  });

  it("no 10 com Brujah usa Rebelião sem rolar de novo", () => {
    const roll = rollCompulsion("Brujah", dice(10, 3));
    expect(roll.tipo).toBe("Clã");
    expect(roll.dados).toEqual([10]);
    expect(roll.tipo === "Clã" && roll.clan?.compulsion).toBe("Rebelião");
  });

  it("no 10 sem clã informado é compulsão de clã sem clã", () => {
    expect(rollCompulsion(null, dice(10, 3))).toEqual({
      dados: [10],
      tipo: "Clã",
    });
  });

  it("Caitiff rola o 10 de novo até sair 1–9", () => {
    expect(rollCompulsion("Caitiff", dice(10, 10, 6))).toEqual({
      dados: [10, 10, 6],
      tipo: "Dano",
    });
  });

  it("Sangue-ralo rola o 10 de novo", () => {
    expect(rollCompulsion("Sangue-ralo", dice(10, 1))).toEqual({
      dados: [10, 1],
      tipo: "Fome",
    });
  });
});

describe("compulsionDiceLine", () => {
  it("mostra um dado", () => {
    expect(compulsionDiceLine(rollCompulsion(null, dice(4)))).toBe(
      "Compulsão d10: 4"
    );
  });

  it("mostra todos os dados quando rolou de novo", () => {
    expect(compulsionDiceLine(rollCompulsion("Caitiff", dice(10, 10, 6)))).toBe(
      "Compulsão d10: 10, 10, 6"
    );
  });
});
