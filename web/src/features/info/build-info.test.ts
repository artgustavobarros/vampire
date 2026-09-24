import { describe, expect, it } from "vitest";
import { buildInfo } from "./build-info";

const current = (niveis: { current: boolean; n: string }[]) =>
  niveis.filter((l) => l.current).map((l) => l.n);

describe("buildInfo", () => {
  it("atributo com 3 pontos destaca •••", () => {
    const info = buildInfo({ key: "Força", kind: "attr", nivel: 3 });
    expect(info.kicker).toBe("Atributo físico");
    expect(info.atual).toBe("3 pontos");
    expect(info.niveis).toHaveLength(5);
    expect(current(info.niveis)).toEqual(["•••"]);
  });

  it("habilidade zerada mostra Sem treino e nada destacado", () => {
    const info = buildInfo({ key: "Ocultismo", kind: "skill", nivel: 0 });
    expect(info.kicker).toBe("Habilidade mental");
    expect(info.atual).toBe("Sem treino");
    expect(current(info.niveis)).toEqual([]);
    expect(info.nota).toBe(
      "Especialidades comuns: Magia, Lendas vampíricas, Fantasmas."
    );
  });

  it("disciplina fora do catálogo", () => {
    const info = buildInfo({ key: "Serpentis", kind: "disc", nivel: 2 });
    expect(info.desc).toBe(
      "Disciplina fora do catálogo. Registre os poderes à mão."
    );
    expect(
      info.niveis.every((l) => l.txt === "Sem poderes catalogados neste nível.")
    ).toBe(true);
    expect(info.atual).toBe("Nível 2");
    expect(current(info.niveis)).toEqual(["2"]);
  });

  it("mérito reconhecido por prefixo", () => {
    const info = buildInfo({
      key: "Recursos (herança)",
      kind: "merit",
      pontos: 2,
      tipo: "vantagem",
    });
    expect(info.titulo).toBe("Recursos (herança)");
    expect(info.desc).toBe("Dinheiro, bens e renda.");
    expect(current(info.niveis)).toEqual(["••"]);
  });

  it("defeito do catálogo usa a escala de defeitos mesmo marcado como vantagem", () => {
    const info = buildInfo({
      key: "Inimigo",
      kind: "merit",
      pontos: 1,
      tipo: "vantagem",
    });
    expect(info.kicker).toBe("Defeito");
    expect(info.niveis[0].txt).toBe("Incômodo menor.");
  });

  it("poder do catálogo com Rouse", () => {
    const info = buildInfo({
      disc: "Alquimia de Sangue Fino",
      key: "Sangue Falso",
      kind: "poder",
      nivel: 1,
    });
    expect(info.nivelTit).toBe("Custo e duração");
    expect(info.niveis.map((l) => l.n)).toEqual(["Custo", "Duração"]);
    expect(info.nota).toBe("Este poder exige Rouse Check.");
  });

  it("poder fora do catálogo usa a descrição registrada", () => {
    const info = buildInfo({
      desc: "Meu poder.",
      disc: "Presença",
      key: "Inventado",
      kind: "poder",
      nivel: 2,
    });
    expect(info.desc).toBe("Meu poder.");
    expect(info.kicker).toBe("Presença · nível 2");
    expect(info.niveis).toEqual([]);
  });

  it("Fome atual destacada", () => {
    const info = buildInfo({ atual: "Fome 3", kind: "fome", marca: "3" });
    expect(current(info.niveis)).toEqual(["3"]);
    expect(info.titulo).toBe("Fome");
  });

  it("Vitalidade lista tipos de dano", () => {
    const info = buildInfo({ kind: "vitalidade" });
    expect(info.nivelTit).toBe("Tipos de dano");
  });
});
