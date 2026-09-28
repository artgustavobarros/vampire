import { normalizeSheet } from "#/lib/sheet";
import type { DamageMark } from "#/lib/types";
import { trackBoxes, vitalityMax, willpowerMax } from "#/rules/tracks";

export interface TrackSummary {
  /** caixas sem dano (superficial ou agravado) */
  atual: number;
  max: number;
}

/** O que o cartão da Lista de personagens mostra de uma ficha criada. */
export interface CharacterSummary {
  cla: string;
  fdv: TrackSummary;
  fome: number;
  nome: string;
  vit: TrackSummary;
}

export function trackSummary(
  marks: readonly DamageMark[] | undefined,
  max: number
): TrackSummary {
  return { atual: trackBoxes(marks, max).filter((m) => m === 0).length, max };
}

/** Resumo da ficha vinda da API; `null` se o personagem ainda não foi criado. */
export function summarize(raw: unknown): CharacterSummary | null {
  if (!raw) {
    return null;
  }
  const sheet = normalizeSheet(raw);
  if (!sheet.criada) {
    return null;
  }
  return {
    cla: sheet.cla ?? "",
    fdv: trackSummary(sheet.fdv, willpowerMax(sheet)),
    fome: sheet.fome || 0,
    nome: sheet.nome?.trim() || "Sem nome",
    vit: trackSummary(sheet.vit, vitalityMax(sheet)),
  };
}
