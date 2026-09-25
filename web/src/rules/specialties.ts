import type { Sheet } from "#/lib/types";

const PREDATOR_SPECIALTY = /^(.+?)\s*\((.+)\)$/;

export interface SpecialtyEntry {
  nome: string;
}

/** Separa "Habilidade (Nome)" da lista do Predador em habilidade e nome sugerido. */
export function splitPredatorSpecialty(
  predEspec: string | undefined
): { skill: string; nome: string } | null {
  const hit = predEspec?.trim().match(PREDATOR_SPECIALTY);
  return hit ? { nome: hit[2], skill: hit[1] } : null;
}

/** Especialidade do Predador: habilidade e nome gravado (ou o sugerido, em fichas antigas). */
export function predatorSpecialty(
  sheet: Sheet
): { skill: string; nome: string } | null {
  const pred = splitPredatorSpecialty(sheet.predEspec);
  if (!pred) {
    return null;
  }
  return { nome: sheet.predEspecNome?.trim() || pred.nome, skill: pred.skill };
}

/** Especialidades por habilidade: as do assistente e a do Predador, sem vazios nem repetições. */
export function specialtiesBySkill(
  sheet: Sheet
): Record<string, SpecialtyEntry[]> {
  const out: Record<string, SpecialtyEntry[]> = {};
  const add = (skill: string, text: string) => {
    const nome = text.trim();
    if (!nome) {
      return;
    }
    const list = out[skill] ?? [];
    if (!list.some((e) => e.nome === nome)) {
      list.push({ nome });
    }
    out[skill] = list;
  };
  for (const [skill, list] of Object.entries(sheet.espec ?? {})) {
    for (const text of list) {
      add(skill, text);
    }
  }
  const pred = predatorSpecialty(sheet);
  if (pred) {
    add(pred.skill, pred.nome);
  }
  return out;
}
