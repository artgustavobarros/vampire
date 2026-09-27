import type { Sheet } from "#/lib/types";
import type { ActionResult } from "./actions";

export interface PreyResonance {
  intensidade: string;
  tipo: string;
}

/** Sacia `amount` de Fome (nunca abaixo de 0) e, com Ressonância, grava a da presa na ficha. */
export function feed(
  sheet: Sheet,
  amount: number,
  resonance?: PreyResonance
): ActionResult {
  const current = sheet.fome || 0;
  const fome = Math.max(0, current - amount);
  const note = `Fome ${current} → ${fome}.`;
  if (!resonance) {
    return { note, patch: { fome } };
  }
  return {
    note: `${note} Ressonância ${resonance.tipo} · ${resonance.intensidade}.`,
    patch: {
      fome,
      resIntensidade: resonance.intensidade,
      ressonancia: resonance.tipo,
    },
  };
}
