import type { Sheet } from "#/lib/types";

const PREDATOR_SPECIALTY = /^(.+?)\s*\((.+)\)$/;

/** Especialidades por habilidade: as do assistente e a do Predador, sem vazios nem repetições. */
export function specialtiesBySkill(sheet: Sheet): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const add = (skill: string, text: string) => {
    const value = text.trim();
    if (!value) {
      return;
    }
    const list = out[skill] ?? [];
    if (!list.includes(value)) {
      list.push(value);
    }
    out[skill] = list;
  };
  for (const [skill, list] of Object.entries(sheet.espec ?? {})) {
    for (const text of list) {
      add(skill, text);
    }
  }
  const pred = sheet.predEspec?.trim().match(PREDATOR_SPECIALTY);
  if (pred) {
    add(pred[1], pred[2]);
  }
  return out;
}
