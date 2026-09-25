import type { Sheet } from "#/lib/types";

const PREDATOR_SPECIALTY = /^(.+?)\s*\((.+)\)$/;

export interface SpecialtyEntry {
  nome: string;
  /** especialidade do Predador ainda não confirmada */
  pendente: boolean;
}

/** Especialidade do Predador: habilidade, nome exibido e se ainda falta confirmar. */
export function predatorSpecialty(
  sheet: Sheet
): { skill: string; nome: string; pendente: boolean } | null {
  const hit = sheet.predEspec?.trim().match(PREDATOR_SPECIALTY);
  if (!hit) {
    return null;
  }
  const confirmed = sheet.predEspecNome?.trim();
  return {
    nome: confirmed || hit[2],
    pendente: confirmed === undefined,
    skill: hit[1],
  };
}

/** Especialidades por habilidade: as do assistente e a do Predador, sem vazios nem repetições. */
export function specialtiesBySkill(
  sheet: Sheet
): Record<string, SpecialtyEntry[]> {
  const out: Record<string, SpecialtyEntry[]> = {};
  const add = (skill: string, text: string, pendente: boolean) => {
    const nome = text.trim();
    if (!nome) {
      return;
    }
    const list = out[skill] ?? [];
    const found = list.find((e) => e.nome === nome);
    if (found) {
      found.pendente ||= pendente;
    } else {
      list.push({ nome, pendente });
    }
    out[skill] = list;
  };
  for (const [skill, list] of Object.entries(sheet.espec ?? {})) {
    for (const text of list) {
      add(skill, text, false);
    }
  }
  const pred = predatorSpecialty(sheet);
  if (pred) {
    add(pred.skill, pred.nome, pred.pendente);
  }
  return out;
}

/** Fixa o nome da especialidade do Predador; `null` sem Predador ou com nome vazio. */
export function confirmPredatorSpecialty(
  sheet: Sheet,
  nome: string
): { patch: Partial<Sheet>; skill: string; nome: string } | null {
  const pred = predatorSpecialty(sheet);
  const value = nome.trim();
  if (!(pred && value)) {
    return null;
  }
  return { nome: value, patch: { predEspecNome: value }, skill: pred.skill };
}
