import type { Sheet } from "#/lib/types";
import type { ActionResult } from "./actions";

export type FeedingKind = "animal" | "bolsa" | "humano" | "letal";

export interface FeedingSource {
  amount: number;
  /** a pessoa escolhe quanto bebeu (1 até `amount`) */
  choose?: boolean;
  kind: FeedingKind;
  name: string;
}

export const FEEDING_SOURCES: readonly FeedingSource[] = [
  { amount: 1, kind: "animal", name: "Vários animais pequenos" },
  { amount: 1, kind: "animal", name: "Animal médio" },
  { amount: 2, kind: "animal", name: "Animal grande" },
  { amount: 1, kind: "bolsa", name: "Bolsa de sangue" },
  { amount: 1, kind: "humano", name: "Pessoa, sem dor e rápido" },
  { amount: 2, kind: "humano", name: "Pessoa, sem dor" },
  { amount: 4, choose: true, kind: "humano", name: "Pessoa" },
  { amount: 5, kind: "letal", name: "Matar a pessoa" },
];

export interface FeedingYield {
  amount: number;
  warning: string;
}

/** Quanto a fonte sacia na Potência de Sangue atual. */
export function feedingYield(
  source: FeedingSource,
  potency: number
): FeedingYield {
  if (source.kind === "animal") {
    if (potency >= 3) {
      return {
        amount: 0,
        warning: `Sangue animal não sacia na Potência ${potency}.`,
      };
    }
    if (potency === 2) {
      return {
        amount: Math.floor(source.amount / 2),
        warning: "Sangue animal rende metade na Potência 2.",
      };
    }
  }
  if (source.kind === "bolsa" && potency >= 3) {
    return {
      amount: 0,
      warning: `Sangue de bolsa não sacia na Potência ${potency}.`,
    };
  }
  if (source.kind === "humano" && potency >= 4) {
    return {
      amount: 0,
      warning: `Na Potência ${potency} só sacia drenando a pessoa por completo.`,
    };
  }
  return { amount: source.amount, warning: "" };
}

export function feed(
  sheet: Sheet,
  amount: number,
  sourceName: string
): ActionResult {
  const current = sheet.fome || 0;
  const real = Math.min(amount, current);
  const fome = current - real;
  return {
    note: `${sourceName}: −${real} de Fome. Fome agora ${fome}.`,
    patch: { fome },
  };
}
