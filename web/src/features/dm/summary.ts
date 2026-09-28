import { normalizeSheet } from "#/lib/sheet";
import type { DamageMark } from "#/lib/types";
import { trackBoxes, vitalityMax, willpowerMax } from "#/rules/tracks";

export interface TrackSummary {
  /** caixas sem dano (superficial ou agravado) */
  atual: number;
  /** as caixas no tamanho do máximo, com as marcas de dano */
  marks: DamageMark[];
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
  const boxes = trackBoxes(marks, max);
  return { atual: boxes.filter((m) => m === 0).length, marks: boxes, max };
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
