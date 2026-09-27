import { describe, expect, it } from "vitest";
import {
  filterMeritOptions,
  findMerit,
  groupMeritOptions,
  meritGroupLabel,
  meritOptions,
  meritPointOptions,
  meritRangeLabel,
  THIN_BLOOD_MERITS,
} from "./merits";

const names = (list: readonly { name: string }[]) => list.map((m) => m.name);

describe("catálogo de méritos no Passo 7", () => {
  it("faixa e custo fixo", () => {
    const recursos = findMerit("Recursos");
    const bonito = findMerit("Bonito");
    expect(recursos && meritPointOptions(recursos)).toEqual([1, 2, 3, 4, 5]);
    expect(bonito && meritPointOptions(bonito)).toEqual([2]);
    expect(meritRangeLabel([1, 2, 3, 4, 5])).toBe("•–•••••");
    expect(meritRangeLabel([2])).toBe("••");
  });

  it("rótulo do grupo", () => {
    expect(meritGroupLabel("Antecedente")).toBe("Antecedentes");
    expect(meritGroupLabel("Aparência")).toBe("Aparência");
    expect(meritGroupLabel(undefined)).toBe("Outros");
  });

  it("Sangue-ralo só para Sangue Fraco", () => {
    expect(names(meritOptions(false))).not.toContain("Bebedor diurno");
    expect(names(meritOptions(true))).toContain("Bebedor diurno");
  });

  it("filtra por aba", () => {
    const flaws = filterMeritOptions(meritOptions(true), {
      query: "",
      tab: "defeitos",
    });
    expect(flaws.every((m) => m.tipo.startsWith("defeito"))).toBe(true);
    const merits = filterMeritOptions(meritOptions(true), {
      query: "",
      tab: "vantagens",
    });
    expect(merits.filter((m) => m.tipo === "qualidade-sr")).toHaveLength(
      THIN_BLOOD_MERITS.length
    );
  });

  it("busca sem acento, nome primeiro", () => {
    const hits = filterMeritOptions(meritOptions(false), {
      query: "mascara",
      tab: "todos",
    });
    expect(hits[0]?.name).toBe("Máscara");
  });

  it("agrupa na ordem do catálogo", () => {
    const groups = groupMeritOptions(meritOptions(false));
    expect(groups[0]?.label).toBe("Antecedentes");
    expect(groups.find((g) => g.label === "Aparência")?.items).toHaveLength(4);
  });
});
