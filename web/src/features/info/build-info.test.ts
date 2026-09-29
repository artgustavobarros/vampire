import { describe, expect, it } from "vitest";
import { MERIT_SCALE_V, SKILL_INFO } from "#/data/trait-info";
import { SKILLS } from "#/data/traits";
import { buildInfo, splitRoll } from "./build-info";

const CAITIFF_BANE = /^Intocados pelos Antidiluvianos/;

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
      `Especialidades comuns: ${SKILL_INFO.Ocultismo?.[1]}.`
    );
  });

  it("habilidade com 3 pontos usa os textos próprios e destaca •••", () => {
    const info = buildInfo({ key: "Briga", kind: "skill", nivel: 3 });
    expect(info.nivelTit).toBe("O que cada ponto significa");
    expect(info.niveis.map((l) => l.txt)).toEqual(SKILL_INFO.Briga?.[2]);
    expect(current(info.niveis)).toEqual(["•••"]);
  });

  it("habilidades diferentes têm textos de nível diferentes", () => {
    const briga = buildInfo({ key: "Briga", kind: "skill", nivel: 2 });
    const financas = buildInfo({ key: "Finanças", kind: "skill", nivel: 2 });
    expect(briga.niveis[1]?.txt).not.toBe(financas.niveis[1]?.txt);
  });

  it("toda habilidade tem 5 níveis com texto", () => {
    for (const key of SKILLS) {
      const info = buildInfo({ key, kind: "skill", nivel: 0 });
      expect(info.niveis, key).toHaveLength(5);
      for (const l of info.niveis) {
        expect(l.txt, key).not.toBe("");
      }
    }
  });

  it("especialidade comum", () => {
    const info = buildInfo({
      key: "Direito",
      kind: "espec",
      nivel: 1,
      skill: "Erudição",
    });
    expect(info.kicker).toBe("Especialidade · Erudição");
    expect(info.titulo).toBe("Direito");
    expect(info.atual).toBe("Erudição 1");
    expect(info.desc).toBe(
      "Um foco dentro de Erudição. Quando a rolagem de Erudição se encaixa nesta especialidade, some 1 dado à parada."
    );
    expect(info.niveis).toEqual([]);
    expect(info.nota).toBe("");
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
    expect(info.desc).toBe(
      "Dinheiro e renda: herança, investimentos ou trabalho noturno."
    );
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
    expect(info.niveis[0].txt).toBe(
      "Um mortal comum que atrapalha quando pode."
    );
  });

  it("mérito do catálogo mostra o texto próprio de cada ponto", () => {
    const info = buildInfo({
      key: "Recursos",
      kind: "merit",
      pontos: 3,
      tipo: "vantagem",
    });
    expect(info.atual).toBe("3 pontos");
    expect(info.niveis).toHaveLength(5);
    expect(info.niveis[2].txt).toBe(
      "Rico; propriedades e dinheiro para gastar sem pensar."
    );
    expect(info.niveis.map((l) => l.txt)).not.toEqual(MERIT_SCALE_V);
    expect(current(info.niveis)).toEqual(["•••"]);
  });

  it("mérito fora do catálogo usa a escala genérica", () => {
    const info = buildInfo({
      key: "Arsenal",
      kind: "merit",
      pontos: 2,
      tipo: "vantagem",
    });
    expect(info.desc).toBe(
      "Vantagem fora do catálogo. Combine o efeito com o Narrador."
    );
    expect(info.niveis.map((l) => l.txt)).toEqual(MERIT_SCALE_V);
    expect(current(info.niveis)).toEqual(["••"]);
  });

  it("mérito por alias traz o nome original e o livro", () => {
    const info = buildInfo({
      key: "Vegano",
      kind: "merit",
      pontos: 2,
      tipo: "defeito",
    });
    expect(info.desc).toContain("gaste 2 de Força de Vontade");
    expect(info.nota).toContain("Original: Farmer · Corebook");
  });

  it("mérito de custo fixo não tem lista de pontos", () => {
    const info = buildInfo({
      key: "Bonito",
      kind: "merit",
      pontos: 2,
      tipo: "vantagem",
    });
    expect(info.niveis).toEqual([]);
  });

  it("pré-requisito no painel", () => {
    const info = buildInfo({
      key: "Zerado",
      kind: "merit",
      pontos: 1,
      tipo: "vantagem",
    });
    expect(info.nota).toContain("Exige Máscara ••");
  });

  it("níveis de Aliados vão de 1 a 4", () => {
    const info = buildInfo({
      key: "Aliados",
      kind: "merit",
      pontos: 4,
      tipo: "vantagem",
    });
    expect(info.niveis.map((l) => l.n)).toEqual(["•", "••", "•••", "••••"]);
    expect(current(info.niveis)).toEqual(["••••"]);
  });

  it("poder do catálogo com checagem de sangue", () => {
    const info = buildInfo({
      disc: "Alquimia de Sangue-fraco",
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
    expect(info.nota).toBe("Este poder exige checagem de sangue.");
  });

  it("nome antigo do poder abre o poder atual", () => {
    const info = buildInfo({
      disc: "Animalismo",
      key: "Sussurro Ferino",
      kind: "poder",
      nivel: 1,
    });
    expect(info.niveis[0]).toMatchObject({
      n: "Parada de Dados",
      txt: "Manipulação + Animalismo ou Carisma + Animalismo",
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
      disc: "Alquimia de Sangue-fraco",
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
      "Retire 2 dados da parada para resistir, você não pode ficar com menos que um dado."
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
    expect(info.niveis[4].txt).toBe("Uma organização inteira caça você.");
    const sr = buildInfo({
      key: "Olfato apurado",
      kind: "merit",
      pontos: 1,
      tipo: "defeito-sr",
    });
    expect(sr.kicker).toBe("Defeito");
  });

  it("extrai a rolagem de descrição com marcação", () => {
    expect(
      splitRoll(
        "Comunica-se com *animais*. Manipulação + Animalismo vs. resistência do animal.",
        "Uma cena"
      )
    ).toEqual({
      desc: "Comunica-se com *animais*.",
      roll: "Manipulação + Animalismo vs. resistência do animal",
    });
  });

  it("poder estruturado preenche texto interno e rótulos de parada de dados, custo, sistema e duração", () => {
    const info = buildInfo({
      disc: "Animalismo",
      key: "Famulus Enlaçado",
      kind: "poder",
      nivel: 1,
    });
    expect(info.desc).toContain("Ao criar um Laço de Sangue com um animal");
    expect(info.niveis.map((l) => l.n)).toEqual([
      "Parada de Dados",
      "Custo",
      "Sistema",
      "Duração",
    ]);
    expect(info.niveis[0]).toMatchObject({
      n: "Parada de Dados",
      txt: "Carisma + Empatia com Animais",
    });
    expect(info.niveis[1]).toMatchObject({
      n: "Custo",
      txt: "Gratuito (exige 3 noites com checagem de sangue)",
    });
    expect(info.niveis[2]).toMatchObject({
      n: "Sistema",
      txt: expect.stringContaining("Sem o uso de Sussurros Ferais"),
    });
    expect(info.niveis[3]).toMatchObject({
      n: "Duração",
      txt: "Apenas a morte liberta",
    });
  });
});
