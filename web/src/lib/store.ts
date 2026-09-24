import { useSyncExternalStore } from "react";
import { hungerAlertFor } from "#/rules/hunger";
import { blankSheet, normalizeSheet } from "./sheet";
import { readSession, readSheetRaw, writeSheet } from "./storage";
import type { Sheet } from "./types";

export interface AppState {
  /** alerta de Fome pendente (0 ou 5) */
  hungerAlert: 0 | 5 | null;
  /** sessão já foi lida do armazenamento (só acontece no cliente) */
  ready: boolean;
  sheet: Sheet;
  user: string | null;
}

const initialState: AppState = {
  hungerAlert: null,
  ready: false,
  sheet: blankSheet(),
  user: null,
};

let state: AppState = initialState;
const listeners = new Set<() => void>();

function set(next: Partial<AppState>): void {
  state = { ...state, ...next };
  for (const l of listeners) {
    l();
  }
}

export const store = {
  dismissHungerAlert(): void {
    set({ hungerAlert: null });
  },
  get(): AppState {
    return state;
  },
  load(user: string): void {
    set({ hungerAlert: null, sheet: normalizeSheet(readSheetRaw(user)), user });
  },
  logout(): void {
    set({ hungerAlert: null, sheet: blankSheet(), user: null });
  },
  /** Mescla, salva e sinaliza o alerta de Fome como o `patch` do standalone. */
  patch(partial: Partial<Sheet>): void {
    const prev = state.sheet;
    const sheet = { ...prev, ...partial };
    let { hungerAlert } = state;
    if ("fome" in partial) {
      hungerAlert =
        hungerAlertFor(prev.fome || 0, sheet.fome || 0) ?? hungerAlert;
    }
    if (state.user) {
      writeSheet(state.user, sheet);
    }
    set({ hungerAlert, sheet });
  },
  /** só para testes */
  reset(): void {
    state = initialState;
  },
  /** Lê a sessão salva. Chamado uma vez no cliente, depois da hidratação. */
  restore(): void {
    if (state.ready) {
      return;
    }
    const user = readSession();
    if (user) {
      store.load(user);
    }
    set({ ready: true });
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

const getServerSnapshot = () => initialState;

export function useAppState(): AppState {
  return useSyncExternalStore(store.subscribe, store.get, getServerSnapshot);
}

export function useSheet(): Sheet {
  return useAppState().sheet;
}

export const patchSheet = store.patch;
