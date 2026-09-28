/**
 * Gerador de NPC do Sertão alagoano, 1936: a aba `NPC` da planilha, em
 * funções puras. As listas e os pesos vêm de `data/npc-lists.ts`.
 */
import { NPC_LISTS, NPC_WEIGHTS, type NpcListName } from "#/data/npc-lists";
import { MOODS, type Mood } from "#/data/resonance";
import type { Die } from "./resonance";

export const PRESENTATIONS = ["Homem", "Mulher"] as const;
export type Presentation = (typeof PRESENTATIONS)[number];

/** 1 · muito pobre e pobre, 2 · remediado, 3 · de posses */
export type Stratum = 1 | 2 | 3;
export const STRATA: readonly { label: string; value: Stratum }[] = [
  { label: "Pobre", value: 1 },
  { label: "Remediado", value: 2 },
  { label: "De posses", value: 3 },
];

export type Exposure = 0 | 1 | 2 | 3 | 4;
export const EXPOSURES: readonly Exposure[] = [0, 1, 2, 3, 4];

export interface NpcFilters {
  apresentacao: Presentation | null;
  estrato: Stratum | null;
  exposicao: Exposure | null;
}

export const RANDOM_NPC: NpcFilters = {
  apresentacao: null,
  estrato: null,
  exposicao: null,
};

export interface Npc {
  alcunha: string | null;
  alfabetizacao: string;
  anoitecer: string;
  aparencia: string;
  apresentacao: Presentation;
  autoridade: string;
  carrega: string;
  comoExplica: string;
  comPjs: string;
  comunidade: string;
  condicao: string;
  corTracos: string;
  detalhe1936: string;
  estadoHoje: string;
  estranhos: string;
  estrato: Stratum;
  evita: string;
  exposicao: Exposure;
  exposicaoTexto: string;
  falhas: [string, string];
  fe: string;
  frase: string;
  gancho: string;
  idade: string;
  madrugada: string;
  maneirismo: string;
  marcaVisivel: string;
  medo: string;
  modoFalar: string;
  motivacao: string;
  nome: string;
  oculto: string;
  ocupacao: string;
  origem: string;
  palavra: string;
  passatempo: string;
  porte: string;
  problema: string;
  reacaoOculto: string;
  reputacao: string;
  /** como na planilha, em minúsculas: "fleumática" */
  ressonancia: string;
  santo: string;
  saudeCorpo: string;
  segredo: string;
  seSumir: string;
  temperamento: string;
  vestimenta: string;
  vinculo: string;
  violencia: string;
  virtudes: [string, string];
}

const list = (name: NpcListName): readonly string[] => NPC_LISTS[name];

/** Um item da lista; repetições contam como peso. */
function pick(name: NpcListName, d: Die): string {
  const items = list(name);
  return items[d(items.length) - 1] as string;
}

/** Dois itens diferentes, com o deslocamento da planilha. */
function pickTwo(name: NpcListName, d: Die): [string, string] {
  const items = list(name);
  const n = items.length;
  const first = d(n);
  const second = ((first - 1 + d(n - 1)) % n) + 1;
  return [items[first - 1] as string, items[second - 1] as string];
}

/** Índice (0-based) sorteado por d100 com pesos em 100. */
function weighted(weights: readonly number[], d: Die): number {
  let roll = d(100);
  for (const [i, w] of weights.entries()) {
    if (roll <= w) {
      return i;
    }
    roll -= w;
  }
  return weights.length - 1;
}

const TIER = ["T1", "T2", "T3"] as const;

/** "fleumática" → "Fleumática" */
export function moodOf(ressonancia: string): Mood {
  const found = MOODS.find(
    (m) => m.toLowerCase() === ressonancia.trim().toLowerCase()
  );
  if (!found) {
    throw new Error(`Ressonância desconhecida: ${ressonancia}`);
  }
  return found;
}

function alcunhaOf(apresentacao: Presentation, d: Die): string | null {
  const roll = d(10);
  if (roll <= 6) {
    const pre = apresentacao === "Homem" ? "Alc_Pre_H" : "Alc_Pre_M";
    return `${pick(pre, d)} ${pick("Alc_Comp", d)}`;
  }
  return roll <= 9 ? pick("Alc_Solta", d) : null;
}

function ganchoOf(d: Die): string {
  if (d(10) <= 5) {
    return pick("Gancho", d);
  }
  return `quer ${pick("Gancho_Verbo", d)} ${pick("Gancho_Alvo", d)}, para ${pick("Gancho_Motivo", d)}`;
}

/** Sorteia um NPC na ordem da aba `NPC`; o que vier nos filtros é fixo. */
export function generateNpc(filtros: NpcFilters, d: Die): Npc {
  const apresentacao =
    filtros.apresentacao ?? (pick("Apresentacao", d) as Presentation);
  const estrato =
    filtros.estrato ?? ((weighted(NPC_WEIGHTS.estrato, d) + 1) as Stratum);
  const tier = TIER[estrato - 1];
  const homem = apresentacao === "Homem";

  const nome = `${pick(homem ? "Nomes_H" : "Nomes_M", d)} ${pick("Sobrenomes", d)}`;
  const alcunha = alcunhaOf(apresentacao, d);
  const ocupacao = pick(`Ocup_${homem ? "H" : "M"}_${tier}` as NpcListName, d);
  const idade = list("Ocup_Ativas").includes(ocupacao)
    ? pick("Idade_Ativa", d)
    : pick("Idade_Geral", d);
  const condicao = pick(`Cond_${tier}` as NpcListName, d);
  const alfabetizacao = list("Ocup_Letradas").includes(ocupacao)
    ? "lê e escreve bem"
    : pick(`Alfab_${tier}` as NpcListName, d);
  const vestimenta = pick(
    `Vest_${homem ? "H" : "M"}_${estrato === 3 ? "Posses" : "Pobre"}` as NpcListName,
    d
  );
  const virtudes = pickTwo("Virtudes", d);
  const falhas = pickTwo("Falhas", d);
  // a ressonância sai da mesma linha do temperamento, não de dado próprio
  const temperamentos = list("Temperamento");
  const linha = d(temperamentos.length) - 1;
  const exposicao =
    filtros.exposicao ?? (weighted(NPC_WEIGHTS.exposicao, d) as Exposure);

  return {
    alcunha,
    alfabetizacao,
    anoitecer: pick("OndeAnoitecer", d),
    aparencia: pick("Aparencia", d),
    apresentacao,
    autoridade: pick("Autoridade", d),
    carrega: `${pick("Carrega_Item", d)} ${pick("Carrega_Material", d)}, ${pick("Carrega_Detalhe", d)}`,
    comoExplica: pick("ComoExplica", d),
    comPjs: pick("Atitude", d),
    comunidade: pick("Comunidade", d),
    condicao,
    corTracos: pick("CorTracos", d),
    detalhe1936: pick("Detalhe1936", d),
    estadoHoje: pick("EstadoHoje", d),
    estranhos: pick("AtitudeEstranhos", d),
    estrato,
    evita: pick("Evita", d),
    exposicao,
    exposicaoTexto: list("Grau_Texto")[exposicao] as string,
    falhas,
    fe: pick("FeDevocao", d),
    frase: pick("Frase", d),
    gancho: ganchoOf(d),
    idade,
    madrugada: pick("OndeMadrugada", d),
    maneirismo: pick("Maneirismo", d),
    marcaVisivel: pick("MarcaVisivel", d),
    medo: pick("Medo", d),
    modoFalar: pick("ModoFalar", d),
    motivacao: pick("Motivacao", d),
    nome,
    oculto: pick(`Oculto_G${exposicao}` as NpcListName, d),
    ocupacao,
    origem: pick("Origem", d),
    palavra: pick("PalavraQueUsa", d),
    passatempo: pick("Passatempo", d),
    porte: pick("Porte", d),
    problema: pick("Problema", d),
    reacaoOculto: pick("ReacaoOculto", d),
    reputacao: pick("Reputacao", d),
    ressonancia: list("Ressonancia")[linha] as string,
    santo: pick("Santo", d),
    saudeCorpo: pick("SaudeCorpo", d),
    segredo: pick("Segredo", d),
    seSumir: pick("SeSumir", d),
    temperamento: temperamentos[linha] as string,
    vestimenta,
    vinculo: pick("Vinculo", d),
    violencia: pick("ReacaoViolencia", d),
    virtudes,
  };
}

/** O "Resumo para ler na mesa", igual à fórmula da planilha. */
export function npcSummary(n: Npc): string {
  const conhecido =
    n.alcunha === null
      ? ""
      : `, ${n.apresentacao === "Homem" ? "conhecido" : "conhecida"} como ${n.alcunha}`;
  return [
    `${n.nome}${conhecido}. ${n.apresentacao}, ${n.idade}.`,
    `Origem: ${n.origem}. Comunidade: ${n.comunidade}.`,
    `Trabalha como ${n.ocupacao}. Condição: ${n.condicao}; ${n.alfabetizacao}.`,
    `Fisicamente: ${n.corTracos}, ${n.porte}, ${n.aparencia}; ${n.saudeCorpo}; ${n.marcaVisivel}.`,
    `Veste ${n.vestimenta}. Hoje está ${n.estadoHoje}.`,
    `Tem ${n.virtudes[0]} e ${n.virtudes[1]}; ${n.temperamento}. Ressonância ${n.ressonancia}.`,
    `Falha por ${n.falhas[0]} e ${n.falhas[1]}.`,
    `Com estranhos, ${n.estranhos}; com autoridade, ${n.autoridade}.`,
    `Diante dos personagens: ${n.comPjs}.`,
    `Na fé, ${n.fe}, com devoção a: ${n.santo}.`,
    `Fala assim: ${n.modoFalar}; ${n.palavra}; ${n.maneirismo}.`,
    `Gosta de ${n.passatempo} e evita ${n.evita}.`,
    `Diante de violência, ${n.violencia}.`,
    `Quer ${n.motivacao}. Teme ${n.medo}. Esconde que ${n.segredo}.`,
    `Reputação: ${n.reputacao}. Vínculo: ${n.vinculo}.`,
    `Agora mesmo, ${n.problema}. Carrega ${n.carrega}.`,
    `Ao anoitecer está ${n.anoitecer}. De madrugada, ${n.madrugada}.`,
    `Se sumir, dá por falta ${n.seSumir}.`,
    `Oculto — ${n.exposicaoTexto}: ${n.oculto}. Diante do assunto, ${n.reacaoOculto}.`,
    `Se for alimentado, culpa ${n.comoExplica}. De época, ${n.detalhe1936}.`,
    `Gancho: ${n.gancho}. Abre a conversa dizendo: “${n.frase}”`,
  ].join(" ");
}
