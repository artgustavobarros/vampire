import type { RoundEntry, RoundState } from "./chronicle.schemas.js";

export const EMPTY_ROUND: RoundState = { ordem: [], rodada: 1, vez: 0 };

/** Lê o `jsonb` gravado, com o estado inicial para o que faltar. */
export function readRound(data: Record<string, unknown> | undefined) {
  const raw = (data ?? {}) as Partial<RoundState>;
  return {
    ordem: Array.isArray(raw.ordem) ? raw.ordem : [],
    rodada: typeof raw.rodada === "number" ? raw.rodada : 1,
    vez: typeof raw.vez === "number" ? raw.vez : 0,
  } satisfies RoundState;
}

/**
 * Tira da ordem os participantes que não passam em `keep`, com a mesma regra
 * do `remove` do web: quem estava antes da vez faz a vez recuar; se sai quem
 * tinha a vez, ela passa ao seguinte (ou ao primeiro, se era o último).
 */
export function keepEntries(
  state: RoundState,
  keep: (entry: RoundEntry) => boolean
): RoundState {
  let { vez } = state;
  const ordem: RoundEntry[] = [];
  state.ordem.forEach((entry, i) => {
    if (keep(entry)) {
      ordem.push(entry);
    } else if (i < state.vez) {
      vez -= 1;
    }
  });
  if (vez >= ordem.length) {
    vez = 0;
  }
  return { ordem, rodada: state.rodada, vez };
}
