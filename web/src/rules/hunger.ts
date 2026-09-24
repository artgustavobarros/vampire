export const MAX_HUNGER = 5;

export function clampHunger(value: number): number {
  return Math.min(MAX_HUNGER, Math.max(0, value));
}

/** O alerta aparece quando a Fome muda e chega a 5 ou a 0. */
export function hungerAlertFor(before: number, after: number): 0 | 5 | null {
  if (after === before) {
    return null;
  }
  if (after === 5 || after === 0) {
    return after;
  }
  return null;
}
