import { findClan } from "#/data/clans";
import { POWERS, type PowerTemplate } from "#/data/disciplines";
import {
  findPredator,
  type MeritOption,
  type Predator,
  type PredatorAdjustment,
} from "#/data/predators";
import type {
  Discipline,
  Merit,
  Power,
  PredatorBonus,
  Sheet,
} from "#/lib/types";
import { addPower, isThinBlood, toPower } from "./wizard";

type Choice = Extract<PredatorAdjustment, { kind: "escolha" }>;
export type PredatorChoices = Record<string, Record<string, number>>;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const meritName = ({ nome, detalhe }: MeritOption) =>
  detalhe ? `${nome} (${detalhe})` : nome;

/** Rótulo de uma opção de escolha ("Segredo Obscuro (diabolista)"). */
export const choiceOptionLabel = meritName;

const choicesOf = (predator: Predator): Choice[] =>
  predator.adjustments.filter((a): a is Choice => a.kind === "escolha");

const sumOf = (predator: Predator, kind: "humanidade" | "potencia") =>
  predator.adjustments.reduce(
    (acc, a) => (a.kind === kind ? acc + a.valor : acc),
    0
  );

/** Pontos já marcados numa escolha. */
export function choiceTotal(picked: Record<string, number> | undefined) {
  return Object.values(picked ?? {}).reduce((acc, n) => acc + (n || 0), 0);
}

function choiceComplete(choice: Choice, picked: Record<string, number>) {
  const filled = choice.opcoes.filter((o) => (picked[o.nome] || 0) > 0);
  if (choice.modo === "uma") {
    return filled.length === 1 && picked[filled[0].nome] === choice.pontos;
  }
  return choiceTotal(picked) === choice.pontos;
}

function choiceMessage(choice: Choice) {
  if (choice.modo === "uma") {
    return `Escolha uma opção: ${choice.label}`;
  }
  const names = choice.opcoes.map((o) => o.nome).join(" e ");
  return `Distribua ${choice.pontos} pontos entre ${names}`;
}

/** Escolhas de ajuste do Predador que ainda faltam, com a mensagem de cada uma. */
export function predatorChoiceStatus(
  predator: Predator,
  escolhas: PredatorChoices | undefined
): { id: string; message: string }[] {
  return choicesOf(predator)
    .filter((c) => !choiceComplete(c, escolhas?.[c.id] ?? {}))
    .map((c) => ({ id: c.id, message: choiceMessage(c) }));
}

/** Linhas de mérito dos ajustes fixos e das opções escolhidas. */
export function predatorMerits(
  predator: Predator,
  escolhas: PredatorChoices | undefined
): Merit[] {
  const out: Merit[] = [];
  for (const a of predator.adjustments) {
    if (a.kind === "merito") {
      out.push({
        nome: meritName(a),
        origem: "predador",
        pontos: a.pontos,
        tipo: a.tipo,
      });
    } else if (a.kind === "escolha") {
      for (const o of a.opcoes) {
        const pontos = escolhas?.[a.id]?.[o.nome] || 0;
        if (pontos > 0) {
          out.push({
            nome: meritName(o),
            origem: "predador",
            pontos,
            tipo: a.tipo,
          });
        }
      }
    }
  }
  return out;
}

export interface PredatorDiscipline {
  /** pontos da Disciplina nas duas posições do assistente */
  atual: number;
  doCla: boolean;
  /** poderes do catálogo que o ponto do Predador pode comprar */
  elegiveis: PowerTemplate[];
  /** nível depois do ponto do Predador */
  novo: number;
}

/**
 * Contexto do ponto de Disciplina do Predador: se ela é do clã (para Caitiff,
 * se foi escolhida no passo 5), o nível antes e depois, e os poderes do
 * catálogo até o novo nível que ainda não foram escolhidos.
 */
export function predatorDiscipline(
  cla: string | undefined,
  disc: readonly Discipline[],
  predDisc: string
): PredatorDiscipline {
  const own = disc.slice(0, 2).find((d) => d.nome === predDisc);
  const atual = own?.nivel || 0;
  const clan = findClan(cla);
  const doCla = clan?.disciplines.includes("Livre escolha")
    ? Boolean(own)
    : (clan?.disciplines.includes(predDisc) ?? false);
  const novo = Math.min(5, atual + 1);
  const taken = new Set(own?.powers.map((p) => p.nome));
  const elegiveis = (POWERS[predDisc] ?? [])
    .filter((p) => p.level <= novo && !taken.has(p.name))
    .sort((x, y) => x.level - y.level);
  return { atual, doCla, elegiveis, novo };
}

/** Poder do Predador escolhido, se ainda for elegível. */
export function predatorPower(
  ctx: PredatorDiscipline,
  predPoder: string | undefined
): PowerTemplate | undefined {
  return ctx.elegiveis.find((p) => p.name === predPoder);
}

const isPredatorMerit = (m: Merit) => m.origem === "predador";

/**
 * Soma o Predador aos valores finais: ponto de Disciplina, Humanidade,
 * Potência (via `predBonus`) e as linhas de mérito. Não aplica duas vezes.
 */
export function applyPredator(sheet: Sheet): Sheet {
  const predator = findPredator(sheet.predador);
  if (
    !predator ||
    isThinBlood(sheet.cla) ||
    sheet.predBonus ||
    sheet.meritos?.some(isPredatorMerit)
  ) {
    return sheet;
  }
  const next: Sheet = { ...sheet };
  const disciplina = sheet.predDisc?.trim() ?? "";
  let novaDisciplina = false;
  const template = (POWERS[disciplina] ?? []).find(
    (p) => p.name === sheet.predPoder
  );
  const poder = template ? toPower(template) : undefined;
  if (disciplina) {
    const has = sheet.disc.some((d) => d.nome === disciplina);
    novaDisciplina = !has;
    next.disc = has
      ? sheet.disc.map((d) =>
          d.nome === disciplina
            ? {
                ...d,
                nivel: Math.min(5, d.nivel + 1),
                powers: poder ? addPower(d.powers, poder) : d.powers,
              }
            : d
        )
      : [
          ...sheet.disc,
          { nivel: 1, nome: disciplina, powers: poder ? [poder] : [] },
        ];
  }
  const before = sheet.humanidade || 0;
  next.humanidade = clamp(before + sumOf(predator, "humanidade"), 0, 10);
  next.meritos = [
    ...(sheet.meritos ?? []),
    ...predatorMerits(predator, sheet.predEscolhas),
  ];
  next.predBonus = {
    disciplina,
    humanidade: next.humanidade - before,
    novaDisciplina,
    poder: poder?.nome,
    potencia: sumOf(predator, "potencia"),
  };
  return next;
}

/** Tira a primeira ocorrência do poder: uma cópia manual sobrevive. */
function withoutPower(powers: Power[], nome: string | undefined): Power[] {
  const i = nome ? powers.findIndex((p) => p.nome === nome) : -1;
  return i < 0 ? powers : powers.filter((_, j) => j !== i);
}

function withoutDisciplineBonus(
  disc: Discipline[],
  { disciplina: nome, novaDisciplina: nova, poder }: PredatorBonus
): Discipline[] {
  if (!nome) {
    return disc;
  }
  if (nova) {
    return disc.filter((d) => d.nome !== nome);
  }
  return disc.map((d) =>
    d.nome === nome
      ? {
          ...d,
          nivel: Math.max(0, d.nivel - 1),
          powers: withoutPower(d.powers, poder),
        }
      : d
  );
}

/** Desfaz `applyPredator`; sem nada aplicado, devolve a mesma ficha. */
export function removePredator(sheet: Sheet): Sheet {
  const bonus = sheet.predBonus;
  const hasMerits = sheet.meritos?.some(isPredatorMerit) ?? false;
  if (!(bonus || hasMerits)) {
    return sheet;
  }
  const next: Sheet = { ...sheet, predBonus: undefined };
  if (hasMerits) {
    next.meritos = (sheet.meritos ?? []).filter((m) => !isPredatorMerit(m));
  }
  if (bonus) {
    next.disc = withoutDisciplineBonus(sheet.disc, bonus);
    next.humanidade = clamp((sheet.humanidade || 0) - bonus.humanidade, 0, 10);
  }
  return next;
}
