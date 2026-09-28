import { describe, expect, it } from "vitest";
import { blankSheet } from "#/lib/sheet";
import type { DicePool } from "#/lib/types";
import { dicePools, poolFormula, poolTotal } from "./dice-pool";

const sheet = blankSheet();
sheet.attrs = {
  ...sheet.attrs,
  Autocontrole: 3,
  Destreza: 2,
  Força: 1,
  Raciocínio: 2,
};
sheet.skills = { ...sheet.skills, "Armas de Fogo": 0, Briga: 1 };

const pool = (p: Partial<DicePool>): DicePool => ({
  id: "p",
  mod: 0,
  nome: "",
  ...p,
});

describe("parada de dados", () => {
  it("atributo e perícia", () => {
    const p = pool({ attr: "Autocontrole", skill: "Armas de Fogo" });
    expect(poolTotal(p, sheet)).toBe(3);
    expect(poolFormula(p, sheet)).toBe("Autocontrole 3 + Armas de Fogo 0");
  });

  it("com modificador negativo", () => {
    const p = pool({ attr: "Destreza", mod: -1, skill: "Briga" });
    expect(poolTotal(p, sheet)).toBe(2);
    expect(poolFormula(p, sheet)).toBe("Destreza 2 + Briga 1 − 1");
  });

  it("só atributo com modificador positivo", () => {
    const p = pool({ attr: "Raciocínio", mod: 1 });
    expect(poolTotal(p, sheet)).toBe(3);
    expect(poolFormula(p, sheet)).toBe("Raciocínio 2 + 1");
  });

  it("total nunca negativo", () => {
    expect(poolTotal(pool({ attr: "Força", mod: -3 }), sheet)).toBe(0);
  });

  it("sem atributo e sem perícia", () => {
    const p = pool({ mod: 2 });
    expect(poolTotal(p, sheet)).toBe(2);
    expect(poolFormula(p, sheet)).toBe("Escolha atributo e perícia");
  });

  it("traço desconhecido conta como nenhum", () => {
    const p = pool({ attr: "Sorte", skill: "Armas de Fogo" });
    expect(poolTotal(p, sheet)).toBe(0);
    expect(poolFormula(p, sheet)).toBe("Armas de Fogo 0");
  });

  it("total acompanha a ficha", () => {
    const p = pool({ attr: "Autocontrole", skill: "Armas de Fogo" });
    const next = { ...sheet, attrs: { ...sheet.attrs, Autocontrole: 4 } };
    expect(poolTotal(p, next)).toBe(4);
  });

  it("descarta entradas inválidas", () => {
    const ok = pool({ nome: "Atirar" });
    expect(
      dicePools({ rolagens: [ok, null, "x"] as unknown as DicePool[] })
    ).toEqual([ok]);
    expect(dicePools({})).toEqual([]);
  });
});
