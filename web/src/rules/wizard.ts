import {
  DEFAULT_DISTRIBUTION,
  SKILL_DISTRIBUTIONS,
} from "#/data/distributions";
import { ATTRIBUTES, SKILLS } from "#/data/traits";
import type { Sheet } from "#/lib/types";

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

export function meritTotals(sheet: Pick<Sheet, "meritos">): {
  vantagens: number;
  defeitos: number;
} {
  let vantagens = 0;
  let defeitos = 0;
  for (const m of sheet.meritos ?? []) {
    if (m.tipo === "defeito") {
      defeitos += m.pontos || 0;
    } else {
      vantagens += m.pontos || 0;
    }
  }
  return { defeitos, vantagens };
}
