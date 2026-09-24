import type { DamageMark, Sheet, TrackKey } from "#/lib/types";

export function vitalityMax(sheet: Pick<Sheet, "attrs">): number {
  return (sheet.attrs.Vigor || 1) + 3;
}

export function willpowerMax(sheet: Pick<Sheet, "attrs">): number {
  return (sheet.attrs.Autocontrole || 1) + (sheet.attrs.Determinação || 1);
}

export function trackMax(sheet: Sheet, key: TrackKey): number {
  return key === "vit" ? vitalityMax(sheet) : willpowerMax(sheet);
}

/** Caixas da trilha no tamanho atual, preservando marcas existentes. */
export function trackBoxes(
  marks: readonly DamageMark[] | undefined,
  max: number
): DamageMark[] {
  const out = (marks ?? []).slice(0, max);
  while (out.length < max) {
    out.push(0);
  }
  return out;
}

/** vazio → superficial → agravado → vazio */
export function cycleBox(
  marks: readonly DamageMark[],
  index: number
): DamageMark[] {
  const next = marks.slice();
  next[index] = (((next[index] ?? 0) + 1) % 3) as DamageMark;
  return next;
}

export interface DamageResult {
  applied: number;
  marks: DamageMark[];
  overflow: number;
}

/**
 * Marca `qty` danos. Sem caixa vazia, um superficial vira agravado (transbordo).
 */
export function addDamage(
  marks: readonly DamageMark[],
  level: 1 | 2,
  qty = 1
): DamageResult {
  const next = marks.slice();
  let applied = 0;
  let overflow = 0;
  for (let n = 0; n < qty; n += 1) {
    const empty = next.indexOf(0);
    if (empty >= 0) {
      next[empty] = level;
      applied += 1;
      continue;
    }
    const superficial = next.indexOf(1);
    if (superficial >= 0) {
      next[superficial] = 2;
      applied += 1;
    }
    overflow += 1;
  }
  return { applied, marks: next, overflow };
}

/** Cura até `amount` danos superficiais, da última caixa para a primeira. */
export function healSuperficial(
  marks: readonly DamageMark[],
  amount: number
): { marks: DamageMark[]; healed: number } {
  const next = marks.slice();
  let healed = 0;
  for (let i = next.length - 1; i >= 0 && healed < amount; i -= 1) {
    if (next[i] === 1) {
      next[i] = 0;
      healed += 1;
    }
  }
  return { healed, marks: next };
}
