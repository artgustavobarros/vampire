import { describe, expect, it } from "vitest";
import { buildInfo } from "./build-info";

const CAITIFF_BANE = /^Sem clã nem Perdição fixa/;

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
    expect(info.nivelTit).toBe("Rolagem, custo e duração");
    expect(info.niveis.map((l) => l.n)).toEqual([
      "Rolagem",
      "Custo",
      "Duração",
    ]);
    expect(info.nota).toBe("Este poder exige Rouse Check.");
  });

  it("rolagem com vs. sai da descrição", () => {
    const info = buildInfo({
      disc: "Animalismo",
      key: "Sussurro Ferino",
      kind: "poder",
      nivel: 1,
    });
    expect(info.desc).toBe("Comunica-se com animais.");
    expect(info.niveis[0]).toMatchObject({
      n: "Rolagem",
      txt: "Manipulação + Animalismo vs. resistência do animal",
    });
  });

  it("poder passivo sem rolagem", () => {
    const info = buildInfo({
      disc: "Auspícios",
      key: "Sentir o Invisível",
      kind: "poder",
      nivel: 1,
    });
    expect(info.niveis[0].txt).toBe("Sem teste: efeito passivo, sempre ativo.");
  });

  it("poder ativo sem rolagem", () => {
    const info = buildInfo({
      disc: "Alquimia de Sangue Fino",
      key: "Desperta o Sangue Adormecido",
      kind: "poder",
      nivel: 1,
    });
    expect(info.niveis[0].txt).toBe("Sem teste: o efeito acontece ao ativar.");
    expect(info.desc).toBe(
      "Fórmula que simula temporariamente um poder de sangue puro."
    );
  });

  it("Geração 12ª destacada", () => {
    const info = buildInfo({ geracao: "12ª", kind: "geracao", potencia: 1 });
    expect(info.kicker).toBe("Sangue");
    expect(info.titulo).toBe("Geração");
    expect(info.atual).toBe("12ª Geração · Potência 1");
    expect(info.desc).toContain("a 12ª começa com Potência 1.");
    expect(info.niveis).toEqual([]);
    const [table] = info.tabelas ?? [];
    expect(table.linhas).toHaveLength(11);
    expect(table.colunas).toHaveLength(7);
    expect(
      table.linhas.filter((r) => r.current).map((r) => r.cells[0])
    ).toEqual(["1"]);
    expect(info.nota).toBe(
      "Linha destacada: Potência 1, a inicial da 12ª Geração."
    );
  });

  it("sem Geração", () => {
    const info = buildInfo({ geracao: "", kind: "geracao", potencia: 0 });
    expect(info.atual).toBe("Potência 0");
    expect(info.desc).toContain("escolha a Geração para ver a sua.");
    expect(info.nota).toBe(
      "Escolha a Geração no passo 1 para destacar a sua Potência inicial."
    );
    expect(info.tabelas?.[0].linhas[0].current).toBe(true);
  });

  it("tabela de Potência de Sangue da 9ª Geração", () => {
    const info = buildInfo({ geracao: "9ª", kind: "potencia", potencia: 2 });
    expect(info.titulo).toBe("Potência de Sangue");
    expect(info.desc).toBe(
      "A força da vitae. Não se escolhe na criação: vem da Geração."
    );
    const linhas = info.tabelas?.[0].linhas ?? [];
    const atual = linhas.find((r) => r.current);
    expect(atual?.cells).toEqual([
      "2",
      "Adicione 2 dados",
      "2 pontos de dano Superficial",
      "Adicione 1 dado",
      "Nível 1",
      "2",
      "Sangue animal ou ensacado sacia meia Fome",
    ]);
    expect(linhas[4].cells[6]).toBe(
      "Sangue animal ou ensacado não sacia nenhuma Fome\nSacia 1 a menos de Fome por humano"
    );
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

  it("Perdição com Gravidade da Potência de Sangue", () => {
    const info = buildInfo({ key: "Brujah", kind: "bane", potencia: 1 });
    expect(info.kicker).toBe("Perdição · Brujah");
    expect(info.titulo).toBe("Temperamento Violento");
    expect(info.atual).toBe("Gravidade 2");
    expect(info.nivelTit).toBe("Regra e rolagem");
    expect(info.niveis.find((l) => l.n === "Rolagem")?.txt).toBe(
      "Retire 2 dados da parada para resistir (mínimo de 1 dado)."
    );
    expect(info.nota).toBe(
      "A Gravidade da Perdição vem da Potência de Sangue (atual: 1)."
    );
  });

  it("Compulsão sem selo, com Efeito e Termina", () => {
    const info = buildInfo({ key: "Ventrue", kind: "comp", potencia: 1 });
    expect(info.kicker).toBe("Compulsão · Ventrue");
    expect(info.atual).toBe("");
    expect(info.niveis.map((l) => l.n)).toEqual(["Efeito", "Termina"]);
  });

  it("Perdição de Caitiff usa o texto curto", () => {
    const info = buildInfo({ key: "Caitiff", kind: "bane", potencia: 0 });
    expect(info.desc).toMatch(CAITIFF_BANE);
    expect(info).toMatchObject({ atual: "", niveis: [], nota: "" });
  });

  it("Defeito SR usa a escala de defeitos", () => {
    const info = buildInfo({
      key: "Inimigo",
      kind: "merit",
      pontos: 1,
      tipo: "defeito-sr",
    });
    expect(info.kicker).toBe("Defeito");
    const sr = buildInfo({
      key: "Olfato apurado",
      kind: "merit",
      pontos: 1,
      tipo: "defeito-sr",
    });
    expect(sr.kicker).toBe("Defeito");
  });
});
