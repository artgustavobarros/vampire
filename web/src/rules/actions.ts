import { bloodPotencyRow } from "#/data/blood-potency";
import type { Sheet } from "#/lib/types";
import { bloodPotency } from "./generation";
import { clampHunger } from "./hunger";
import {
  healSuperficial,
  trackBoxes,
  vitalityMax,
  willpowerMax,
} from "./tracks";

export interface ActionResult {
  note: string;
  patch: Partial<Sheet>;
}

export function rouseCheck(
  sheet: Sheet,
  passed: boolean,
  frenzyWarning: boolean
): ActionResult {
  const current = sheet.fome || 0;
  if (passed) {
    return { note: `Fome permanece em ${current}. Sem alteração.`, patch: {} };
  }
  const fome = clampHunger(current + 1);
  const note =
    fome >= 5 && frenzyWarning
      ? `Fome ${fome}. Frenesi de Fome: teste de Determinação para não caçar.`
      : `Fome sobe para ${fome}.`;
  return { note, patch: { fome } };
}

export function bloodSurgeNote(sheet: Sheet): string {
  return `Surto de Sangue: ${bloodPotencyRow(bloodPotency(sheet)).bloodSurge} no teste.`;
}

export function sleep(sheet: Sheet, healOnSleep: boolean): ActionResult {
  const noites = (sheet.noites || 0) + 1;
  if (!healOnSleep) {
    return { note: "Nada a curar.", patch: { noites } };
  }
  const mend = bloodPotencyRow(bloodPotency(sheet)).mend || 1;
  const vit = healSuperficial(trackBoxes(sheet.vit, vitalityMax(sheet)), mend);
  const willpowerHeal = Math.max(
    sheet.attrs.Autocontrole || 0,
    sheet.attrs.Determinação || 0
  );
  const fdv = healSuperficial(
    trackBoxes(sheet.fdv, willpowerMax(sheet)),
    willpowerHeal
  );
  const note =
    vit.healed || fdv.healed
      ? `${vit.healed} de vitalidade superficial curada · ${fdv.healed} de Força de Vontade restaurada.`
      : "Nada a curar nesta noite.";
  return { note, patch: { fdv: fdv.marks, noites, vit: vit.marks } };
}

/** Cura 1 agravado (vira superficial); cada Rouse Check falho soma 1 de Fome. */
export function healAggravated(sheet: Sheet, failures: number): ActionResult {
  const fome = clampHunger((sheet.fome || 0) + failures);
  const cost = failures
    ? `${failures}${failures > 1 ? " Rouse Checks falharam" : " Rouse Check falhou"}: Fome ${fome}.`
    : `Nenhum Rouse Check falhou. Fome permanece em ${fome}.`;
  const vit = trackBoxes(sheet.vit, vitalityMax(sheet));
  const i = vit.lastIndexOf(2);
  if (i < 0) {
    return {
      note: `Nenhum dano agravado marcado na vitalidade. ${cost}`,
      patch: { fome },
    };
  }
  vit[i] = 1;
  return {
    note: `1 de dano agravado curado (passa a superficial). ${cost}`,
    patch: { fome, vit },
  };
}
