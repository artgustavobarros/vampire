import { GENERATIONS } from "#/data/generations";
import type { Sheet } from "#/lib/types";

const NON_DIGITS = /[^0-9]/g;

/** Número da geração ("12ª" → 12); `NaN` quando não há número. */
function generationNumber(generation: string | undefined): number {
  return Number.parseInt(String(generation ?? "").replace(NON_DIGITS, ""), 10);
}

/** Potência de Sangue da geração; `null` quando a geração não é reconhecida. */
export function potencyFromGeneration(
  generation: string | undefined
): number | null {
  const n = generationNumber(generation);
  if (!n) {
    return null;
  }
  const row = GENERATIONS.find((g) => Number.parseInt(g.label, 10) === n);
  if (row) {
    return row.bloodPotency;
  }
  if (n > 16) {
    return 0;
  }
  if (n < 4) {
    return 5;
  }
  return null;
}

type PotencySource = Pick<Sheet, "geracao" | "potencia">;

export function bloodPotency(sheet: PotencySource): number {
  return potencyFromGeneration(sheet.geracao) ?? (sheet.potencia || 0);
}

export function potencyNote(sheet: PotencySource): string {
  const potency = bloodPotency(sheet);
  if (potencyFromGeneration(sheet.geracao) !== null) {
    return `Geração ${sheet.geracao} — Potência de Sangue ${potency}.`;
  }
  if (sheet.geracao) {
    return `Geração "${sheet.geracao}" não reconhecida — usando Potência de Sangue ${potency}.`;
  }
  return "Escolha a Geração para definir a Potência de Sangue.";
}

/** Geração do senhor, uma acima da do personagem. */
export function sireNote(generation: string | undefined): string {
  const n = generationNumber(generation);
  return n
    ? `Seu senhor é da ${n - 1}ª Geração (você é sempre uma Geração acima do senhor).`
    : "Você é sempre uma Geração acima do seu senhor.";
}
