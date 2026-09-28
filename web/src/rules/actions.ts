import { bloodPotencyRow } from "#/data/blood-potency";
import type { Sheet, TrackKey } from "#/lib/types";
import { bloodPotency } from "./generation";
import { clampHunger } from "./hunger";
import { healMarks, trackBoxes, vitalityMax, willpowerMax } from "./tracks";

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
  const surge = bloodPotencyRow(bloodPotency(sheet)).bloodSurge;
  return `Surto de Sangue: ${surge.toLowerCase()} ao teste.`;
}

/** Força de Vontade Superficial recuperada por noite: maior entre Autocontrole e Determinação. */
export function willpowerRecovery(sheet: Pick<Sheet, "attrs">): number {
  return Math.max(sheet.attrs.Autocontrole || 0, sheet.attrs.Determinação || 0);
}

/** Dica do custo da cura no formulário "Curar-se"; o app não cobra esse custo. */
export function healHint(sheet: Sheet, track: TrackKey, level: 1 | 2): string {
  if (track === "fdv") {
    return level === 1
      ? `Ao dormir, a Força de Vontade recupera ${willpowerRecovery(sheet)} de dano Superficial.`
      : "Dano Agravado de Força de Vontade se recupera com o tempo, a critério do Narrador.";
  }
  if (level === 2) {
    return "Cada 1 de dano Agravado curado exige três checagens de sangue.";
  }
  const potency = bloodPotency(sheet);
  const mend = bloodPotencyRow(potency).mend || 1;
  return `Com Potência de Sangue ${potency}, cada checagem de sangue cura ${mend} de dano Superficial.`;
}

export function sleep(sheet: Sheet, healOnSleep: boolean): ActionResult {
  const noites = (sheet.noites || 0) + 1;
  if (!healOnSleep) {
    return { note: "Nada a curar.", patch: { noites } };
  }
  const mend = bloodPotencyRow(bloodPotency(sheet)).mend || 1;
  const vit = healMarks(trackBoxes(sheet.vit, vitalityMax(sheet)), 1, mend);
  const fdv = healMarks(
    trackBoxes(sheet.fdv, willpowerMax(sheet)),
    1,
    willpowerRecovery(sheet)
  );
  const note =
    vit.healed || fdv.healed
      ? `${vit.healed} de vitalidade superficial curada · ${fdv.healed} de Força de Vontade restaurada.`
      : "Nada a curar nesta noite.";
  return { note, patch: { fdv: fdv.marks, noites, vit: vit.marks } };
}

/** Cura 1 agravado (vira superficial); cada checagem de sangue falha soma 1 de Fome. */
export function healAggravated(sheet: Sheet, failures: number): ActionResult {
  const fome = clampHunger((sheet.fome || 0) + failures);
  const cost = failures
    ? `${failures}${failures > 1 ? " checagens de sangue falharam" : " checagem de sangue falhou"}: Fome ${fome}.`
    : `Nenhuma checagem de sangue falhou. Fome permanece em ${fome}.`;
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
