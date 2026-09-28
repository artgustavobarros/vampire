import { ATTRIBUTES, SKILLS } from "#/data/traits";
import type { Sheet } from "./types";

export function blankSheet(): Sheet {
  const attrs: Record<string, number> = {};
  for (const name of ATTRIBUTES) {
    attrs[name] = 1;
  }
  const skills: Record<string, number> = {};
  for (const name of SKILLS) {
    skills[name] = 0;
  }
  return {
    attrs,
    conv: [
      { c: "", p: "" },
      { c: "", p: "" },
      { c: "", p: "" },
    ],
    criada: false,
    disc: [],
    fdv: [],
    fome: 1,
    humanidade: 7,
    manchas: 0,
    noites: 0,
    potencia: 1,
    ressonancia: "",
    sessoes: [{ data: "", resumo: "", xp: "" }],
    skills,
    vit: [],
    xpGasto: "",
    xpTotal: "",
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Completa campos ausentes com os padrões e descarta disciplinas sem nome,
 * como o `loadUser` do standalone. `null` vale como campo ausente: é assim
 * que a gravação na API apaga um campo (o JSON não leva `undefined`).
 */
export function normalizeSheet(raw: unknown): Sheet {
  const base = blankSheet();
  if (!isRecord(raw)) {
    return base;
  }
  const present = Object.fromEntries(
    Object.entries(raw).filter(([, value]) => value !== null)
  );
  const sheet = { ...base, ...present } as Sheet;
  sheet.attrs = {
    ...base.attrs,
    ...(isRecord(raw.attrs) ? raw.attrs : {}),
  } as Record<string, number>;
  sheet.skills = {
    ...base.skills,
    ...(isRecord(raw.skills) ? raw.skills : {}),
  } as Record<string, number>;
  for (const key of ["vit", "fdv", "disc", "conv", "sessoes"] as const) {
    if (!Array.isArray(sheet[key])) {
      (sheet as Record<string, unknown>)[key] = base[key];
    }
  }
  sheet.disc = sheet.disc
    .filter((d) => (d?.nome ?? "").trim())
    .map((d) => ({
      ...d,
      nivel: d.nivel ?? 0,
      powers: Array.isArray(d.powers) ? d.powers : [],
    }));
  return sheet;
}
