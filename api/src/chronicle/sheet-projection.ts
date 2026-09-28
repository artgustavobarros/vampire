import type { ProjectedSheet } from "./chronicle.schemas.js";

const KEYS = ["nome", "cla", "criada", "fome", "vit", "fdv"] as const;
/** o bastante para o web calcular o máximo das trilhas */
const ATTRS = ["Vigor", "Autocontrole", "Determinação"] as const;

/**
 * A parte da ficha que outro jogador pode ver (Coterie e Rodada): nada de
 * e-mail, notas, Habilidades ou Disciplinas.
 */
export function projectSheet(
  data: Record<string, unknown> | null
): ProjectedSheet | null {
  if (!data) {
    return null;
  }
  const out: Record<string, unknown> = {};
  for (const key of KEYS) {
    if (key in data) {
      out[key] = data[key];
    }
  }
  const attrs = (data.attrs ?? {}) as Record<string, unknown>;
  out.attrs = Object.fromEntries(
    ATTRS.filter((a) => typeof attrs[a] === "number").map((a) => [a, attrs[a]])
  );
  return out as ProjectedSheet;
}
