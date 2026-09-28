import { describe, expect, it } from "vitest";
import {
  ALL_MERIT_TEMPLATES,
  filterMeritOptions,
  findMerit,
  groupMeritOptions,
  meritGroupLabel,
  meritKeys,
  meritOptions,
  meritPointOptions,
  meritRangeLabel,
} from ".";
import { THIN_BLOOD_FLAWS, THIN_BLOOD_MERITS } from "./thin-blood";

const PASTED_TEXT = /Méritos de|méritos de|V:tM/;

const names = (list: readonly { name: string }[]) => list.map((m) => m.name);

describe("catálogo de méritos no Passo 7", () => {
  it("faixa e custo fixo", () => {
    const recursos = findMerit("Recursos");
    const bonito = findMerit("Bonito");
    expect(recursos && meritPointOptions(recursos)).toEqual([1, 2, 3, 4, 5]);
    expect(bonito && meritPointOptions(bonito)).toEqual([2]);
    expect(meritRangeLabel([1, 2, 3, 4, 5])).toBe("•–•••••");
    expect(meritRangeLabel([2])).toBe("••");
    expect(meritRangeLabel([2, 4])).toBe("••/••••");
    expect(meritRangeLabel([0])).toBe("—");
  });

  it("rótulo do grupo", () => {
    expect(meritGroupLabel("Antecedente")).toBe("Antecedentes");
    expect(meritGroupLabel("Aparência")).toBe("Aparência");
    expect(meritGroupLabel(undefined)).toBe("Outros");
  });

  it("Sangue-ralo só para Sangue-ralo", () => {
    expect(names(meritOptions({ cla: "Brujah" }))).not.toContain(
      "Bebedor Diurno"
    );
    expect(names(meritOptions({ cla: "Sangue-ralo" }))).toContain(
      "Bebedor Diurno"
    );
    expect(names(meritOptions({ cla: "Sangue Fraco" }))).toContain(
      "Bebedor Diurno"
    );
  });

  it("Caitiff só para Caitiff", () => {
    expect(names(meritOptions({ cla: "Brujah" }))).not.toContain(
      "Sangue Favorecido"
    );
    expect(names(meritOptions({ cla: "Caitiff" }))).toContain(
      "Sangue Favorecido"
    );
  });

  it("exclusão por clã", () => {
    expect(names(meritOptions({ cla: "Ventrue" }))).not.toContain("Fazendeiro");
    expect(names(meritOptions({ cla: "Gangrel" }))).toContain("Fazendeiro");
  });

  it("Falha Enraizada exige a Disciplina", () => {
    const opts = names(
      meritOptions({ cla: "Brujah", disciplinas: ["Potência", "Presença"] })
    );
    expect(opts).toContain("Instinto Assassino");
    expect(opts).toContain("Egomaníaco");
    expect(opts).not.toContain("Indomado");
  });

  it("carniçais fora do assistente", () => {
    const opts = meritOptions({ cla: "Brujah" });
    expect(opts.some((m) => m.category === "Carniçais")).toBe(false);
    expect(findMerit("Empatia de Sangue")?.category).toBe("Carniçais");
  });

  it("filtra por aba", () => {
    const opts = meritOptions({ cla: "Sangue-ralo" });
    const flaws = filterMeritOptions(opts, { query: "", tab: "defeitos" });
    expect(flaws.every((m) => m.tipo.startsWith("defeito"))).toBe(true);
    const merits = filterMeritOptions(opts, { query: "", tab: "vantagens" });
    expect(merits.filter((m) => m.tipo === "qualidade-sr")).toHaveLength(
      THIN_BLOOD_MERITS.length
    );
  });

  it("busca sem acento, nome primeiro", () => {
    const hits = filterMeritOptions(meritOptions({ cla: "Brujah" }), {
      query: "mascara",
      tab: "todos",
    });
    expect(hits[0]?.name).toBe("Máscara");
  });

  it("busca pelo nome em inglês", () => {
    const hits = filterMeritOptions(meritOptions({ cla: "Brujah" }), {
      query: "iron gullet",
      tab: "todos",
    });
    expect(hits[0]?.name).toBe("Estômago de Ferro");
  });

  it("agrupa na ordem do catálogo, sub-itens depois dos Antecedentes", () => {
    const groups = groupMeritOptions(meritOptions({ cla: "Brujah" }));
    expect(groups[0]?.label).toBe("Antecedentes");
    expect(groups[1]?.label).toBe("Antecedente · Aliados");
    expect(groups.find((g) => g.label === "Aparência")?.items).toHaveLength(9);
  });
});

describe("findMerit", () => {
  it("resolve alias e nome antigo", () => {
    expect(findMerit("Vegano")?.name).toBe("Fazendeiro");
    expect(findMerit("Assombrado")?.name).toBe("Refúgio Assombrado");
    expect(findMerit("Conta Sobrenatural")?.name).toBe("Sinal Sobrenatural");
    expect(findMerit("Belíssimo")?.name).toBe("Bonito");
    expect(findMerit("farmer")?.name).toBe("Fazendeiro");
  });

  it("detalhe entre parênteses", () => {
    expect(findMerit("Recursos (herança)")?.name).toBe("Recursos");
    expect(findMerit("Presa Excluída (mortais)")?.name).toBe("Presa Excluída");
  });

  it("não casa por prefixo", () => {
    expect(findMerit("Arsenal")).toBeUndefined();
    expect(findMerit("Perseguido")).toBeUndefined();
    expect(findMerit("Monstruoso")).toBeUndefined();
  });
});

describe("conteúdo do catálogo", () => {
  it("nomes e aliases únicos", () => {
    const seen = new Map<string, string>();
    for (const m of ALL_MERIT_TEMPLATES) {
      for (const k of new Set(meritKeys(m))) {
        expect(seen.get(k), `${k}: ${m.name} × ${seen.get(k)}`).toBeUndefined();
        seen.set(k, m.name);
      }
    }
  });

  it("todo item tem livro, descrição e nome em inglês", () => {
    for (const m of ALL_MERIT_TEMPLATES) {
      expect(m.source, m.name).toBeTruthy();
      expect(m.description.length, m.name).toBeGreaterThan(20);
      expect(m.aliases?.length, m.name).toBeGreaterThan(0);
    }
  });

  it("um texto de nível por valor permitido", () => {
    for (const m of ALL_MERIT_TEMPLATES.filter((x) => x.levels)) {
      expect(m.levels?.length, m.name).toBe(meritPointOptions(m).length);
    }
  });

  it("pré-requisitos apontam para itens do catálogo", () => {
    for (const m of ALL_MERIT_TEMPLATES) {
      const req = m.requires;
      if (req && "merit" in req) {
        expect(findMerit(req.merit)?.name, m.name).toBe(req.merit);
      }
    }
  });

  it("Sangue-ralo: 14 qualidades e 16 defeitos, sem texto colado", () => {
    expect(THIN_BLOOD_MERITS).toHaveLength(14);
    expect(THIN_BLOOD_FLAWS).toHaveLength(16);
    expect(names(THIN_BLOOD_FLAWS)).toEqual(
      expect.arrayContaining(["Presença do Crepúsculo", "Fome Infinita"])
    );
    for (const m of [...THIN_BLOOD_MERITS, ...THIN_BLOOD_FLAWS]) {
      expect(m.description, m.name).not.toMatch(PASTED_TEXT);
    }
  });

  it("custos do V5", () => {
    expect(findMerit("Feio")?.points).toBe(1);
    expect(findMerit("Repulsivo")?.points).toBe(2);
    expect(findMerit("Evitado")?.points).toBe(2);
    expect(
      meritPointOptions(findMerit("Aliados") ?? ALL_MERIT_TEMPLATES[0])
    ).toEqual([2, 3, 4, 5, 6]);
    expect(findMerit("Zerado")?.requires).toEqual({ merit: "Máscara", min: 2 });
  });

  it("contagem por categoria", () => {
    const count = (category: string) =>
      ALL_MERIT_TEMPLATES.filter((m) => m.category === category).length;
    expect(count("Antecedente")).toBe(11);
    expect(count("Linguística")).toBe(1);
    expect(count("Aparência")).toBe(9);
    expect(count("Uso de Substâncias")).toBe(3);
    expect(count("Arcaicos")).toBe(2);
    expect(count("Laço de Sangue")).toBe(6);
    expect(count("Alimentação")).toBe(8);
    expect(count("Míticos")).toBe(9);
    expect(count("Falhas de Disciplina Enraizada")).toBe(11);
    expect(count("Outros")).toBe(9);
    expect(count("Caitiff")).toBe(12);
    expect(count("Carniçais")).toBe(5);
    expect(count("Antecedente · Refúgio")).toBe(21);
    expect(
      ALL_MERIT_TEMPLATES.filter((m) => m.category.startsWith("Cult")).length
    ).toBe(24);
  });
});
