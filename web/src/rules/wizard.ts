import { findClan } from "#/data/clans";
import {
  DISCIPLINES,
  findPower,
  type PowerTemplate,
  sameDiscipline,
} from "#/data/disciplines";
import {
  DEFAULT_DISTRIBUTION,
  SKILL_DISTRIBUTIONS,
} from "#/data/distributions";
import { findMerit, meritClanAllowed, meritDisciplineMet } from "#/data/merits";
import { ATTRIBUTES, SKILLS } from "#/data/traits";
import type { Discipline, Merit, MeritKind, Power, Sheet } from "#/lib/types";

/** Um atributo em 4, três em 3, um em 1; o resto em 2. */
export const ATTRIBUTE_TARGETS: Readonly<Record<4 | 3 | 1, number>> = {
  1: 1,
  3: 3,
  4: 1,
};

export type QuotaState = "pending" | "done" | "over";

export interface AttributeQuota {
  label: string;
  level: 4 | 3 | 1;
  /** quantos ainda faltam (negativo = excesso) */
  remaining: number;
  state: QuotaState;
  target: number;
}

export function attributeQuotas(attrs: Record<string, number>): {
  quotas: AttributeQuota[];
  summary: string;
} {
  const count = { 1: 0, 3: 0, 4: 0 };
  for (const name of ATTRIBUTES) {
    const v = attrs[name] || 0;
    if (v === 4 || v === 3 || v === 1) {
      count[v] += 1;
    }
  }
  const levels = [4, 3, 1] as const;
  const quotas = levels.map((level) => {
    const target = ATTRIBUTE_TARGETS[level];
    const remaining = target - count[level];
    let state: QuotaState = "pending";
    if (remaining === 0) {
      state = "done";
    } else if (remaining < 0) {
      state = "over";
    }
    return {
      label: `${level}${level === 1 ? " ponto" : " pontos"}`,
      level,
      remaining,
      state,
      target,
    };
  });
  const exceeded = quotas.some((q) => q.state === "over");
  const missing = quotas.reduce((acc, q) => acc + Math.max(0, q.remaining), 0);
  let summary = "Distribuição completa.";
  if (exceeded) {
    summary = "Você passou de alguma cota: ajuste os pontos.";
  } else if (missing) {
    summary = `${missing}${missing === 1 ? " escolha restante." : " escolhas restantes."}`;
  }
  return { quotas, summary };
}

/** Ao sair do passo 1, atributos ainda em 1 (ou menos) começam em 2. */
export function initialAttributes(
  attrs: Record<string, number>
): Record<string, number> | null {
  if (!ATTRIBUTES.every((n) => (attrs[n] || 0) <= 1)) {
    return null;
  }
  const next = { ...attrs };
  for (const n of ATTRIBUTES) {
    next[n] = 2;
  }
  return next;
}

export interface DistributionLine {
  current: number;
  done: boolean;
  level: number;
  target: number;
}

export function skillDistributionProgress(
  sheet: Pick<Sheet, "dist" | "skills">
): DistributionLine[] {
  const dist =
    SKILL_DISTRIBUTIONS.find((d) => d.name === (sheet.dist ?? "")) ??
    DEFAULT_DISTRIBUTION;
  return Object.keys(dist.targets)
    .map(Number)
    .sort((a, b) => b - a)
    .map((level) => {
      const current = SKILLS.filter(
        (n) => (sheet.skills[n] || 0) === level
      ).length;
      const target = dist.targets[level];
      return { current, done: current === target, level, target };
    });
}

export interface StraySkill {
  level: number;
  name: string;
}

export interface DistributionCheck {
  lines: DistributionLine[];
  /** vazia quando a distribuição está completa */
  message: string;
  /** habilidades com pontos num nível que a distribuição não prevê */
  stray: StraySkill[];
}

function lineMessage({ level, current, target }: DistributionLine): string {
  const diff = target - current;
  const n = Math.abs(diff);
  if (diff > 0) {
    return `Nível ${level}: ${n === 1 ? "falta" : "faltam"} ${n}.`;
  }
  return `Nível ${level}: ${n === 1 ? "sobra" : "sobram"} ${n}.`;
}

/** Progresso e validação do passo 3 numa regra só: tudo verde = passo válido. */
export function skillDistributionCheck(
  sheet: Pick<Sheet, "dist" | "skills">
): DistributionCheck {
  const lines = skillDistributionProgress(sheet);
  const levels = new Set(lines.map((l) => l.level));
  const stray = SKILLS.flatMap((name) => {
    const level = sheet.skills[name] || 0;
    return level > 0 && !levels.has(level) ? [{ level, name }] : [];
  });
  const parts = lines.filter((l) => !l.done).map(lineMessage);
  if (stray.length) {
    parts.push(
      `Fora do formato: ${stray.map((s) => `${s.name} (${s.level})`).join(", ")}.`
    );
  }
  return { lines, message: parts.join(" "), stray };
}

export function distributionSummary(
  targets: Readonly<Record<number, number>>
): string {
  return Object.keys(targets)
    .map(Number)
    .sort((a, b) => b - a)
    .map((k) => `${targets[k]}× nível ${k}`)
    .join(" · ");
}

/** Clã sem Disciplinas intrínsecas, sem Predador e com Qualidades/Defeitos próprios. */
export const THIN_BLOOD = "Sangue Fraco";

export const isThinBlood = (cla: string | undefined) => {
  const trimmed = (cla ?? "").trim();
  return trimmed === THIN_BLOOD || trimmed === "Sangue-ralo";
};

export type ClanDisciplineKind = "none" | "clan" | "free" | "thin";

/** Disciplinas que os slots do passo 5 oferecem e o aviso da regra. */
export function clanDisciplineOptions(cla: string | undefined): {
  aviso: string;
  kind: ClanDisciplineKind;
  options: readonly string[];
} {
  const clan = findClan(cla);
  if (!clan) {
    return {
      aviso: "Escolha o clã no passo 1 para ver as Disciplinas disponíveis.",
      kind: "none",
      options: DISCIPLINES,
    };
  }
  if (clan.name === THIN_BLOOD || clan.name === "Sangue-ralo") {
    return {
      aviso:
        "Sangues-ralos não têm Disciplinas intrínsecas. Siga para o próximo passo.",
      kind: "thin",
      options: [],
    };
  }
  if (clan.disciplines.includes("Livre escolha")) {
    return {
      aviso:
        "Caitiff: escolha duas Disciplinas quaisquer. Dois pontos em uma, um ponto na outra.",
      kind: "free",
      options: DISCIPLINES,
    };
  }
  return {
    aviso: `Escolha duas Disciplinas do clã ${clan.name} (${clan.disciplines.join(", ")}). Dois pontos em uma, um ponto na outra.`,
    kind: "clan",
    options: clan.disciplines,
  };
}

/** Ao trocar de clã, esvazia os slots cuja Disciplina não pertence ao novo clã. */
export function keepClanDisciplines(
  disc: readonly Discipline[],
  cla: string | undefined
): Discipline[] {
  const { options } = clanDisciplineOptions(cla);
  return disc.map((d) =>
    !d.nome || options.some((o) => sameDiscipline(o, d.nome))
      ? d
      : { nivel: 0, nome: "", powers: [] }
  );
}

/** Status da distribuição 2 + 1 das duas Disciplinas do assistente. */
export function disciplineDistribution(
  disc: readonly Pick<Discipline, "nome" | "nivel">[],
  cla: string | undefined
): { levelsOk: boolean; message: string; namesOk: boolean; ok: boolean } {
  if (isThinBlood(cla)) {
    return { levelsOk: true, message: "", namesOk: true, ok: true };
  }
  const [a, b] = [disc[0], disc[1]];
  const namesOk = Boolean(a?.nome.trim() && b?.nome.trim());
  const levels = [a?.nivel || 0, b?.nivel || 0].sort().join("+");
  const levelsOk = levels === "1+2";
  if (namesOk && levelsOk) {
    return {
      levelsOk,
      message: "Distribuição completa: 2 e 1.",
      namesOk,
      ok: true,
    };
  }
  const missing = [
    namesOk ? "" : "escolher as duas Disciplinas",
    levelsOk ? "" : "marcar 2 pontos em uma e 1 na outra",
  ].filter(Boolean);
  return {
    levelsOk,
    message: `Falta: ${missing.join(" e ")}.`,
    namesOk,
    ok: false,
  };
}

const powerCount = (n: number) => `${n} ${n === 1 ? "poder" : "poderes"}`;

/** Dica acima dos poderes do slot: cada ponto dá direito a um poder. */
export function powerLimitHint(nivel: number, chosen: number): string {
  return nivel
    ? `Escolha ${powerCount(nivel)} (um por ponto) · ${chosen}/${nivel} escolhidos. Toque no nome para ver a descrição.`
    : "Marque os pontos primeiro: cada ponto dá direito a um poder. Toque no nome para ver a descrição.";
}

/** Poder do catálogo no formato gravado na ficha. */
export const toPower = (p: PowerTemplate): Power => ({
  custo: p.cost,
  desc: p.description,
  duracao: p.duration,
  nivel: p.level,
  nome: p.name,
  rouse: p.rouse,
});

const byLevel = (x: Power, y: Power) => (x.nivel || 1) - (y.nivel || 1);

/** Acrescenta um poder mantendo a ordem por nível. */
export const addPower = (powers: readonly Power[], power: Power): Power[] =>
  [...powers, power].sort(byLevel);

/** Poderes que cabem num slot de nível `nivel`: até o nível e no máximo um por ponto. */
export function trimPowers(powers: readonly Power[], nivel: number): Power[] {
  return powers
    .filter((p) => (p.nivel || 1) <= nivel)
    .sort(byLevel)
    .slice(0, nivel);
}

const AMALGAM_RE = /^(.+\S)\s+(\d)$/;

/** Amálgama ("Ofuscação 2") satisfeito pelas Disciplinas da ficha; sem amálgama, sempre. */
export function amalgamMet(
  amalgam: string | undefined,
  disc: readonly Discipline[]
): boolean {
  const match = amalgam ? AMALGAM_RE.exec(amalgam.trim()) : null;
  if (!match) {
    return true;
  }
  const [, nome, nivel] = match;
  return disc.some(
    (d) => sameDiscipline(d.nome, nome) && (d.nivel || 0) >= Number(nivel)
  );
}

/** Poderes de `nome` cujo amálgama deixou de ser atendido por `disc`. */
export function unmetAmalgams(
  nome: string,
  powers: readonly Power[],
  disc: readonly Discipline[]
): Power[] {
  return powers.filter(
    (p) => !amalgamMet(findPower(nome, p.nome)?.amalgam, disc)
  );
}

/** Tira dos slots os poderes de amálgama que perderam a Disciplina exigida. */
export function dropUnmetAmalgams(disc: readonly Discipline[]): Discipline[] {
  return disc.map((d) => {
    const unmet = new Set(unmetAmalgams(d.nome, d.powers, disc));
    return unmet.size
      ? { ...d, powers: d.powers.filter((p) => !unmet.has(p)) }
      : d;
  });
}

/** Motivo para não incluir mais um poder no slot; `null` quando cabe. */
export function powerToggleBlock(
  nome: string,
  nivel: number,
  count: number
): { msg: string; titulo: string } | null {
  if (!nivel) {
    return {
      msg: "Marque os pontos da Disciplina antes de escolher poderes.",
      titulo: "Sem pontos",
    };
  }
  if (count >= nivel) {
    const pts = nivel === 1 ? "1 ponto" : `${nivel} pontos`;
    return {
      msg: `${nome} tem ${pts}: só ${powerCount(nivel)}. Tire um para trocar.`,
      titulo: "Limite de poderes",
    };
  }
  return null;
}

/** Tipos que o selo do passo 7 cicla, na ordem. */
export function meritKinds(cla: string | undefined): readonly MeritKind[] {
  return isThinBlood(cla)
    ? ["vantagem", "defeito", "qualidade-sr", "defeito-sr"]
    : ["vantagem", "defeito"];
}

/** Fora do Sangue Fraco, Qualidade SR vale como Vantagem e Defeito SR como Defeito. */
export function effectiveMeritKind(
  tipo: MeritKind,
  cla: string | undefined
): MeritKind {
  if (isThinBlood(cla)) {
    return tipo;
  }
  if (tipo === "qualidade-sr") {
    return "vantagem";
  }
  return tipo === "defeito-sr" ? "defeito" : tipo;
}

export interface MeritTotals {
  defeitos: number;
  /** linhas, não pontos */
  defeitosSR: number;
  /** linhas, não pontos */
  qualidadesSR: number;
  vantagens: number;
}

export function meritTotals(
  meritos: readonly Merit[] | undefined,
  cla: string | undefined
): MeritTotals {
  const totals: MeritTotals = {
    defeitos: 0,
    defeitosSR: 0,
    qualidadesSR: 0,
    vantagens: 0,
  };
  for (const m of meritos ?? []) {
    // linhas do Predador ficam fora da cota 7/2
    if (m.origem === "predador") {
      continue;
    }
    const tipo = effectiveMeritKind(m.tipo, cla);
    if (tipo === "vantagem") {
      totals.vantagens += m.pontos || 0;
    } else if (tipo === "defeito") {
      totals.defeitos += m.pontos || 0;
    } else if (tipo === "qualidade-sr") {
      totals.qualidadesSR += 1;
    } else {
      totals.defeitosSR += 1;
    }
  }
  return totals;
}

export const MERIT_TARGETS = { defeitos: 2, vantagens: 7 } as const;

function quotaGap(
  total: number,
  target: number,
  unit: "vantagens" | "defeitos"
): string {
  if (total < target) {
    return `${unit === "vantagens" ? "distribuir" : "adquirir"} ${target - total} pts em ${unit}`;
  }
  if (total > target) {
    return `remover ${total - target} pts de ${unit}`;
  }
  return "";
}

/** Pontos de um item do catálogo na lista (nome ou alias). */
function meritPoints(meritos: readonly Merit[], name: string): number {
  return Math.max(
    0,
    ...meritos
      .filter((m) => findMerit(m.nome)?.name === name)
      .map((m) => m.pontos || 0)
  );
}

/** Pré-requisitos, clã e Disciplinas exigidas de cada linha do catálogo. */
function meritRequirementGaps(
  meritos: readonly Merit[],
  cla: string | undefined,
  disciplinas: readonly string[] | undefined
): string[] {
  return meritos.flatMap((m) => {
    const canon = findMerit(m.nome);
    if (!canon) {
      return [];
    }
    const req = canon.requires;
    if (req && "merit" in req && meritPoints(meritos, req.merit) < req.min) {
      return [`${canon.name} exige ${req.merit} ${"•".repeat(req.min)}`];
    }
    if (!meritClanAllowed(canon, cla)) {
      return [`${(cla ?? "").trim()} não pode ter ${canon.name}`];
    }
    if (req && "discipline" in req && !meritDisciplineMet(canon, disciplinas)) {
      return [`${canon.name} exige a Disciplina ${req.discipline}`];
    }
    return [];
  });
}

/** Linha de status do passo 7 (a mesma mensagem vai para o toast). */
export function meritStatus(
  meritos: readonly Merit[] | undefined,
  cla: string | undefined,
  disciplinas?: readonly string[]
): { message: string; ok: boolean; totals: MeritTotals } {
  const totals = meritTotals(meritos, cla);
  const pending = [
    quotaGap(totals.vantagens, MERIT_TARGETS.vantagens, "vantagens"),
    quotaGap(totals.defeitos, MERIT_TARGETS.defeitos, "defeitos"),
  ];
  if (isThinBlood(cla)) {
    if (totals.qualidadesSR < 1 || totals.qualidadesSR > 3) {
      pending.push("ter de 1 a 3 Qualidades de Sangue-Ralo");
    }
    if (totals.defeitosSR !== totals.qualidadesSR) {
      pending.push("igualar Defeitos de Sangue-Ralo às Qualidades");
    }
  }
  pending.push(...meritRequirementGaps(meritos ?? [], cla, disciplinas));
  const missing = [...new Set(pending.filter(Boolean))];
  return missing.length
    ? { message: `Falta: ${missing.join(" · ")}.`, ok: false, totals }
    : { message: "Distribuição completa.", ok: true, totals };
}
