import type { Sheet } from "#/lib/types";

const BOXES = 10;

/** Manchas por caixa. Fichas antigas só com `manchas` marcam as últimas caixas. */
export function stains(sheet: Sheet): boolean[] {
  const out = Array.isArray(sheet.manchasIdx)
    ? sheet.manchasIdx.slice(0, BOXES).map(Boolean)
    : Array.from(
        { length: BOXES },
        (_, k) => k + 1 > BOXES - (sheet.manchas || 0)
      );
  while (out.length < BOXES) {
    out.push(false);
  }
  return out;
}

export function toggleStain(
  sheet: Sheet,
  index: number
): Pick<Sheet, "manchasIdx" | "manchas"> {
  const next = stains(sheet);
  next[index] = !next[index];
  return { manchas: next.filter(Boolean).length, manchasIdx: next };
}

export function adjustHumanity(sheet: Sheet, delta: number): number {
  return Math.min(10, Math.max(0, (sheet.humanidade || 0) + delta));
}
