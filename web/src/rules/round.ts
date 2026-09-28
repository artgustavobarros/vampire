import type { RoundEntry, RoundState } from "#/lib/types";

export const EMPTY_ROUND: RoundState = { ordem: [], rodada: 1, vez: 0 };

export const INITIATIVE_MAX = 30;

const sameEntry = (a: RoundEntry, b: RoundEntry) =>
  a.tipo === b.tipo && a.id === b.id;

/** Quem age agora; `undefined` com a ordem vazia. */
export function currentEntry(state: RoundState): RoundEntry | undefined {
  return state.ordem[state.vez];
}

export function includes(
  state: RoundState,
  tipo: RoundEntry["tipo"],
  id: string
): boolean {
  return state.ordem.some((e) => e.tipo === tipo && e.id === id);
}

/** Troca a ordem mantendo a vez com o mesmo participante. */
function reorder(state: RoundState, ordem: RoundEntry[]): RoundState {
  const current = currentEntry(state);
  const vez = current ? ordem.findIndex((e) => sameEntry(e, current)) : 0;
  return { ...state, ordem, vez: Math.max(vez, 0) };
}

/** Avança a vez; depois do último, volta ao primeiro e soma uma rodada. */
export function next(state: RoundState): RoundState {
  if (state.ordem.length === 0) {
    return state;
  }
  if (state.vez + 1 < state.ordem.length) {
    return { ...state, vez: state.vez + 1 };
  }
  return { ...state, rodada: state.rodada + 1, vez: 0 };
}

export function canPrev(state: RoundState): boolean {
  return state.ordem.length > 0 && (state.rodada > 1 || state.vez > 0);
}

/** Volta a vez; antes do primeiro, vai ao último da rodada anterior. */
export function prev(state: RoundState): RoundState {
  if (!canPrev(state)) {
    return state;
  }
  if (state.vez > 0) {
    return { ...state, vez: state.vez - 1 };
  }
  return { ...state, rodada: state.rodada - 1, vez: state.ordem.length - 1 };
}

/** Rodada 1, vez do primeiro; a ordem não muda. */
export function restart(state: RoundState): RoundState {
  return { ...state, rodada: 1, vez: 0 };
}

/** Maior iniciativa primeiro, vazia por último, empates na ordem atual. */
export function sortByInitiative(state: RoundState): RoundState {
  const ordem = state.ordem
    .map((entry, i) => ({ entry, i }))
    .sort((a, b) => {
      const x = a.entry.iniciativa ?? -1;
      const y = b.entry.iniciativa ?? -1;
      return y - x || a.i - b.i;
    })
    .map(({ entry }) => entry);
  return reorder(state, ordem);
}

/** Troca o participante `i` com o vizinho acima (−1) ou abaixo (+1). */
export function move(state: RoundState, i: number, dir: -1 | 1): RoundState {
  const j = i + dir;
  if (j < 0 || j >= state.ordem.length) {
    return state;
  }
  const ordem = [...state.ordem];
  [ordem[i], ordem[j]] = [ordem[j] as RoundEntry, ordem[i] as RoundEntry];
  return reorder(state, ordem);
}

/**
 * Tira o participante `i`. Antes da vez, a vez recua; se era a vez dele, ela
 * passa a quem vem depois (ou ao primeiro, se era o último), na mesma rodada.
 */
export function remove(state: RoundState, i: number): RoundState {
  if (i < 0 || i >= state.ordem.length) {
    return state;
  }
  const ordem = state.ordem.filter((_, k) => k !== i);
  let vez = i < state.vez ? state.vez - 1 : state.vez;
  if (vez >= ordem.length) {
    vez = 0;
  }
  return { ...state, ordem, vez };
}

/** Acrescenta no fim, sem iniciativa; quem já está não entra de novo. */
export function add(
  state: RoundState,
  tipo: RoundEntry["tipo"],
  id: string
): RoundState {
  if (includes(state, tipo, id)) {
    return state;
  }
  return { ...state, ordem: [...state.ordem, { id, iniciativa: null, tipo }] };
}

/** Tira o participante pelo tipo e id (ex.: "Na rodada · tirar"). */
export function removeEntry(
  state: RoundState,
  tipo: RoundEntry["tipo"],
  id: string
): RoundState {
  return remove(
    state,
    state.ordem.findIndex((e) => e.tipo === tipo && e.id === id)
  );
}

export function clear(): RoundState {
  return EMPTY_ROUND;
}

/** Iniciativa de 0 a 30; `null` limpa. */
export function setInitiative(
  state: RoundState,
  i: number,
  iniciativa: number | null
): RoundState {
  const value =
    iniciativa === null
      ? null
      : Math.min(INITIATIVE_MAX, Math.max(0, Math.trunc(iniciativa)));
  return {
    ...state,
    ordem: state.ordem.map((e, k) =>
      k === i ? { ...e, iniciativa: value } : e
    ),
  };
}

/** O estado gravável a partir da visão de `GET /round`. */
export function stateOf(view: {
  ordem: readonly RoundEntry[];
  rodada: number;
  vez: number;
}): RoundState {
  return {
    ordem: view.ordem.map(({ id, iniciativa, tipo }) => ({
      id,
      iniciativa,
      tipo,
    })),
    rodada: view.rodada,
    vez: view.vez,
  };
}
