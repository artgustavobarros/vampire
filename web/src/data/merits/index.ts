// Catálogo de Vantagens, Defeitos, Antecedentes e Características de Sangue-ralo (V5 PT-BR).
import { findClan } from "#/data/clans";
import { sameDiscipline } from "#/data/disciplines";
import type { MeritKind } from "#/lib/types";
import { BACKGROUND_EXTRAS, BACKGROUNDS } from "./backgrounds";
import { CAITIFF } from "./caitiff";
import { GENERAL } from "./general";
import { INGRAINED_FLAWS } from "./ingrained";
import type { MeritTemplate } from "./model";
import { THIN_BLOOD_FLAWS, THIN_BLOOD_MERITS } from "./thin-blood";

export type { MeritRequirement, MeritTemplate } from "./model";

export const ALL_MERIT_TEMPLATES: readonly MeritTemplate[] = [
  ...BACKGROUNDS,
  ...BACKGROUND_EXTRAS,
  ...GENERAL,
  ...INGRAINED_FLAWS,
  ...CAITIFF,
  ...THIN_BLOOD_MERITS,
  ...THIN_BLOOD_FLAWS,
];

const NORMALIZE = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

/** Nome e aliases normalizados. */
export const meritKeys = (m: MeritTemplate): string[] =>
  [m.name, ...(m.aliases ?? [])].map(NORMALIZE);

const matches = (m: MeritTemplate, key: string) => meritKeys(m).includes(key);

/** Por nome ou alias; "Nome (detalhe)" cai no nome-base. Nunca por prefixo. */
export function findMerit(name: string | undefined): MeritTemplate | undefined {
  if (!name) {
    return undefined;
  }
  const full = NORMALIZE(name);
  const base = NORMALIZE(name.replace(/\s*\([^)]*\)/g, ""));
  return (
    ALL_MERIT_TEMPLATES.find((m) => NORMALIZE(m.name) === full) ??
    ALL_MERIT_TEMPLATES.find((m) => matches(m, full)) ??
    (base ? ALL_MERIT_TEMPLATES.find((m) => matches(m, base)) : undefined)
  );
}

/** Valores de pontos aceitos: o custo fixo ou a faixa do catálogo. */
export function meritPointOptions(m: MeritTemplate): readonly number[] {
  return typeof m.points === "number" ? [m.points] : m.points;
}

/** "—" sem valor, "••" fixo, "•–•••••" faixa, "••/••••" valores soltos. */
export function meritRangeLabel(values: readonly number[]): string {
  if (values.every((v) => v === 0)) {
    return "—";
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return "•".repeat(min);
  }
  return values.length === max - min + 1
    ? `${"•".repeat(min)}–${"•".repeat(max)}`
    : values.map((v) => "•".repeat(v)).join("/");
}

const GROUP_LABEL: Record<string, string> = { Antecedente: "Antecedentes" };

export function meritGroupLabel(category: string | undefined): string {
  if (!category) {
    return "Outros";
  }
  return GROUP_LABEL[category] ?? category;
}

/** "Exige Máscara ••" ou "Exige a Disciplina Dominação". */
export function meritRequirementLabel(m: MeritTemplate): string | undefined {
  const req = m.requires;
  if (!req) {
    return undefined;
  }
  return "merit" in req
    ? `Exige ${req.merit} ${"•".repeat(req.min)}`
    : `Exige a Disciplina ${req.discipline}`;
}

export interface MeritContext {
  cla?: string;
  disciplinas?: readonly string[];
}

/** `clans` e `excludeClans`, com "Sangue Fraco" e "Sangue-ralo" como o mesmo clã. */
export function meritClanAllowed(
  m: MeritTemplate,
  cla: string | undefined
): boolean {
  const clan = findClan(cla)?.name ?? (cla ?? "").trim();
  if (m.clans && !m.clans.includes(clan)) {
    return false;
  }
  return !m.excludeClans?.includes(clan);
}

/** A Disciplina de `requires.discipline` está entre as do personagem. */
export function meritDisciplineMet(
  m: MeritTemplate,
  disciplinas: readonly string[] | undefined
): boolean {
  const req = m.requires;
  if (!(req && "discipline" in req)) {
    return true;
  }
  return (disciplinas ?? []).some((d) => sameDiscipline(d, req.discipline));
}

/** Opções do Passo 7: só os permitidos ao clã e às Disciplinas. */
export function meritOptions(ctx: MeritContext): readonly MeritTemplate[] {
  return ALL_MERIT_TEMPLATES.filter(
    (m) =>
      meritClanAllowed(m, ctx.cla) && meritDisciplineMet(m, ctx.disciplinas)
  );
}

export type MeritTab = "todos" | "vantagens" | "defeitos";

export const isFlawKind = (tipo: MeritKind) =>
  tipo === "defeito" || tipo === "defeito-sr";

/** Filtra por aba e busca (sem acento/maiúsculas); acertos no nome ou alias vêm primeiro. */
export function filterMeritOptions(
  options: readonly MeritTemplate[],
  { tab, query }: { query: string; tab: MeritTab }
): MeritTemplate[] {
  const q = NORMALIZE(query);
  const inTab = options.filter(
    (m) => tab === "todos" || (tab === "defeitos") === isFlawKind(m.tipo)
  );
  if (!q) {
    return inTab;
  }
  const rank = (m: MeritTemplate) => {
    if (meritKeys(m).some((k) => k.includes(q))) {
      return 0;
    }
    if (NORMALIZE(meritGroupLabel(m.category)).includes(q)) {
      return 1;
    }
    return NORMALIZE(m.description).includes(q) ? 2 : -1;
  };
  const hits = inTab.map((m) => ({ m, r: rank(m) })).filter(({ r }) => r >= 0);
  return [0, 1, 2].flatMap((r) =>
    hits.filter((h) => h.r === r).map((h) => h.m)
  );
}

export interface MeritGroup {
  items: MeritTemplate[];
  label: string;
}

/** Agrupa pela categoria, na ordem da primeira aparição. */
export function groupMeritOptions(
  list: readonly MeritTemplate[]
): MeritGroup[] {
  const groups: MeritGroup[] = [];
  for (const m of list) {
    const label = meritGroupLabel(m.category);
    const group = groups.find((g) => g.label === label);
    if (group) {
      group.items.push(m);
    } else {
      groups.push({ items: [m], label });
    }
  }
  return groups;
}

export const sameMeritName = (a: string, b: string) =>
  NORMALIZE(a) === NORMALIZE(b);
