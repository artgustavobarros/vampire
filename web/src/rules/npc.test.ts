import { describe, expect, it } from "vitest";
import { NPC_LISTS, NPC_WEIGHTS, type NpcListName } from "#/data/npc-lists";
import {
  generateNpc,
  moodOf,
  type Npc,
  type NpcFilters,
  npcSummary,
  RANDOM_NPC,
} from "./npc";
import { type Die, rollDie } from "./resonance";

const has = (name: NpcListName, value: string) =>
  (NPC_LISTS[name] as readonly string[]).includes(value);

/** Muitos NPCs com dado de verdade, para conferir as regras da planilha. */
function many(filtros: NpcFilters = RANDOM_NPC, n = 400): Npc[] {
  return Array.from({ length: n }, () => generateNpc(filtros, rollDie));
}

const lowest: Die = () => 1;
const highest: Die = (faces) => faces;

describe("listas do gerador", () => {
  it.each([
    "Nomes_H",
    "Nomes_M",
    "Sobrenomes",
    "Apresentacao",
    "Idade_Geral",
    "Idade_Ativa",
    "Origem",
    "Cond_T1",
    "Cond_T2",
    "Cond_T3",
    "Ocup_H_T1",
    "Ocup_H_T2",
    "Ocup_H_T3",
    "Ocup_M_T1",
    "Ocup_M_T2",
    "Ocup_M_T3",
    "Alfab_T1",
    "Alfab_T2",
    "Alfab_T3",
    "Ocup_Letradas",
    "Ocup_Ativas",
    "CorTracos",
    "Porte",
    "Aparencia",
    "SaudeCorpo",
    "MarcaVisivel",
    "Vest_H_Pobre",
    "Vest_H_Posses",
    "Vest_M_Pobre",
    "Vest_M_Posses",
    "Virtudes",
    "Temperamento",
    "Falhas",
    "AtitudeEstranhos",
    "Autoridade",
    "FeDevocao",
    "Santo",
    "ModoFalar",
    "Maneirismo",
    "Passatempo",
    "Evita",
    "ReacaoViolencia",
    "Motivacao",
    "Medo",
    "Segredo",
    "Reputacao",
    "Vinculo",
    "Problema",
    "Gancho",
    "Grau_Texto",
    "Oculto_G0",
    "Oculto_G1",
    "Oculto_G2",
    "Oculto_G3",
    "Oculto_G4",
    "ReacaoOculto",
    "Detalhe1936",
    "Frase",
    "Atitude",
    "Comunidade",
    "EstadoHoje",
    "Alc_Pre_H",
    "Alc_Pre_M",
    "Alc_Comp",
    "Alc_Solta",
    "PalavraQueUsa",
    "Gancho_Verbo",
    "Gancho_Alvo",
    "Gancho_Motivo",
    "Carrega_Item",
    "Carrega_Material",
    "Carrega_Detalhe",
    "Ressonancia",
    "OndeAnoitecer",
    "OndeMadrugada",
    "SeSumir",
    "ComoExplica",
  ] as const)("%s existe e não está vazia", (name) => {
    expect(NPC_LISTS[name].length).toBeGreaterThan(0);
  });

  it("temperamento e ressonância estão alinhados linha a linha", () => {
    expect(NPC_LISTS.Ressonancia).toHaveLength(NPC_LISTS.Temperamento.length);
    for (const r of NPC_LISTS.Ressonancia) {
      expect(() => moodOf(r)).not.toThrow();
    }
  });

  it("os pesos somam 100", () => {
    const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
    expect(sum(NPC_WEIGHTS.estrato)).toBe(100);
    expect(sum(NPC_WEIGHTS.exposicao)).toBe(100);
    expect(NPC_LISTS.Grau_Texto).toHaveLength(5);
  });

  it("as colunas que a planilha não usa ficam de fora", () => {
    for (const name of ["Alcunha_H", "Alcunha_M", "Carrega", "OndeEncontra"]) {
      expect(name in NPC_LISTS).toBe(false);
    }
  });
});

describe("regras do NPC", () => {
  it("ocupação letrada força 'lê e escreve bem'", () => {
    const letrados = many({ ...RANDOM_NPC, estrato: 3 }, 600).filter((n) =>
      has("Ocup_Letradas", n.ocupacao)
    );
    expect(letrados.length).toBeGreaterThan(0);
    for (const n of letrados) {
      expect(n.alfabetizacao).toBe("lê e escreve bem");
    }
  });

  it("ocupação de corpo tira a idade de Idade_Ativa", () => {
    const ativos = many({ ...RANDOM_NPC, apresentacao: "Homem" }, 600).filter(
      (n) => has("Ocup_Ativas", n.ocupacao)
    );
    expect(ativos.length).toBeGreaterThan(0);
    for (const n of ativos) {
      expect(has("Idade_Ativa", n.idade)).toBe(true);
    }
  });

  it("virtudes e falhas nunca se repetem, nem com o mesmo número", () => {
    const n = generateNpc(RANDOM_NPC, lowest);
    expect(n.virtudes[0]).not.toBe(n.virtudes[1]);
    expect(n.falhas[0]).not.toBe(n.falhas[1]);
    for (const x of many()) {
      expect(x.virtudes[0]).not.toBe(x.virtudes[1]);
      expect(x.falhas[0]).not.toBe(x.falhas[1]);
    }
  });

  it("estrato 'De posses' usa as listas T3 e de posses", () => {
    for (const n of many({ ...RANDOM_NPC, estrato: 3 }, 200)) {
      expect(has("Cond_T3", n.condicao)).toBe(true);
      const homem = n.apresentacao === "Homem";
      expect(has(homem ? "Ocup_H_T3" : "Ocup_M_T3", n.ocupacao)).toBe(true);
      expect(has(homem ? "Vest_H_Posses" : "Vest_M_Posses", n.vestimenta)).toBe(
        true
      );
    }
  });

  it("apresentação e exposição fixas são respeitadas", () => {
    for (const n of many(
      { apresentacao: "Mulher", estrato: 1, exposicao: 2 },
      100
    )) {
      expect(n.apresentacao).toBe("Mulher");
      expect(has("Nomes_M", n.nome.split(" ")[0] as string)).toBe(true);
      expect(n.exposicaoTexto.startsWith("2 —")).toBe(true);
      expect(has("Oculto_G2", n.oculto)).toBe(true);
    }
  });

  it("a ressonância sai da mesma linha do temperamento", () => {
    for (const n of many()) {
      const i = NPC_LISTS.Temperamento.indexOf(n.temperamento as never);
      expect(NPC_LISTS.Ressonancia[i]).toBe(n.ressonancia);
    }
  });

  it("d10 baixo: alcunha composta e gancho da lista", () => {
    const n = generateNpc(RANDOM_NPC, lowest);
    expect(n.alcunha).toBe(
      `${NPC_LISTS.Alc_Pre_H[0]} ${NPC_LISTS.Alc_Comp[0]}`
    );
    expect(n.gancho).toBe(NPC_LISTS.Gancho[0]);
    expect(n.estrato).toBe(1);
    expect(n.exposicao).toBe(0);
  });

  it("d10 alto: sem alcunha e gancho composto", () => {
    const n = generateNpc(RANDOM_NPC, highest);
    expect(n.alcunha).toBeNull();
    expect(n.gancho).toBe(
      `quer ${NPC_LISTS.Gancho_Verbo.at(-1)} ${NPC_LISTS.Gancho_Alvo.at(-1)}, para ${NPC_LISTS.Gancho_Motivo.at(-1)}`
    );
    expect(n.estrato).toBe(3);
    expect(n.exposicao).toBe(4);
  });

  it("o resumo segue a fórmula da planilha", () => {
    const n = generateNpc({ ...RANDOM_NPC, apresentacao: "Mulher" }, lowest);
    const text = npcSummary(n);
    expect(
      text.startsWith(
        `${n.nome}, conhecida como ${n.alcunha}. Mulher, ${n.idade}. Origem: ${n.origem}.`
      )
    ).toBe(true);
    expect(text).toContain(`Ressonância ${n.ressonancia}.`);
    expect(text.endsWith(`Abre a conversa dizendo: “${n.frase}”`)).toBe(true);

    const semAlcunha = generateNpc(RANDOM_NPC, highest);
    expect(
      npcSummary(semAlcunha).startsWith(
        `${semAlcunha.nome}. ${semAlcunha.apresentacao}, ${semAlcunha.idade}.`
      )
    ).toBe(true);
  });

  it("moodOf põe a inicial maiúscula e recusa o desconhecido", () => {
    expect(moodOf("fleumática")).toBe("Fleumática");
    expect(moodOf("Sanguínea")).toBe("Sanguínea");
    expect(() => moodOf("azul")).toThrow();
  });
});
