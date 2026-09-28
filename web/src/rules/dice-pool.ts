import { ATTRIBUTES, SKILLS } from "#/data/traits";
import type { DicePool, Sheet } from "#/lib/types";

export const POOL_MOD_MIN = -10;
export const POOL_MOD_MAX = 10;

type Traits = Pick<Sheet, "attrs" | "skills">;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Paradas salvas na ficha, sem as entradas que não são objeto. */
export function dicePools(sheet: Pick<Sheet, "rolagens">): DicePool[] {
  return Array.isArray(sheet.rolagens) ? sheet.rolagens.filter(isRecord) : [];
}

/** Atributo e perícia escolhidos, com o valor atual; nome desconhecido = nenhum. */
function parts(pool: DicePool, sheet: Traits): [string, number][] {
  const out: [string, number][] = [];
  if (pool.attr && ATTRIBUTES.includes(pool.attr)) {
    out.push([pool.attr, sheet.attrs[pool.attr] ?? 0]);
  }
  if (pool.skill && SKILLS.includes(pool.skill)) {
    out.push([pool.skill, sheet.skills[pool.skill] ?? 0]);
  }
  return out;
}

/** Atributo + perícia + modificador, nunca abaixo de 0. */
export function poolTotal(pool: DicePool, sheet: Traits): number {
  const sum = parts(pool, sheet).reduce((acc, [, value]) => acc + value, 0);
  return Math.max(0, sum + (pool.mod || 0));
}

/** "Autocontrole 3 + Armas de Fogo 0 − 1", ou o convite a escolher. */
export function poolFormula(pool: DicePool, sheet: Traits): string {
  const chosen = parts(pool, sheet);
  if (chosen.length === 0) {
    return "Escolha atributo e perícia";
  }
  const text = chosen.map(([name, value]) => `${name} ${value}`).join(" + ");
  const mod = pool.mod || 0;
  if (mod === 0) {
    return text;
  }
  return `${text} ${mod > 0 ? "+" : "−"} ${Math.abs(mod)}`;
}
