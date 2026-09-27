import { create } from "zustand";
import { blankSheet, normalizeSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import { hungerAlertFor } from "#/rules/hunger";
import { createSheetSync } from "./sheet-sync";

export interface CharacterState {
  /** alerta de Fome pendente (0 ou 5) */
  hungerAlert: 0 | 5 | null;
  /** e-mail do jogador dono da ficha; sem dono, a ficha fica só em memória */
  owner: string | null;
  sheet: Sheet;
}

export interface CharacterActions {
  clear: () => void;
  dismissHungerAlert: () => void;
  /** Carrega a ficha vinda da API (`null` = ainda não existe). */
  load: (email: string, raw: unknown) => void;
  /** Mescla, agenda a gravação e sinaliza o alerta de Fome como o `patch` do standalone. */
  patch: (partial: Partial<Sheet>) => void;
}

const sync = createSheetSync(() => useCharacterStore.getState().sheet);

export const useCharacterStore = create<CharacterState & CharacterActions>()(
  (set, get) => ({
    clear() {
      sync.reset();
      set({ hungerAlert: null, owner: null, sheet: blankSheet() });
    },
    dismissHungerAlert() {
      set({ hungerAlert: null });
    },
    hungerAlert: null,
    load(email, raw) {
      sync.reset();
      set({ hungerAlert: null, owner: email, sheet: normalizeSheet(raw) });
    },
    owner: null,
    patch(partial) {
      const { owner, sheet: prev } = get();
      const sheet = { ...prev, ...partial };
      let { hungerAlert } = get();
      if ("fome" in partial) {
        hungerAlert =
          hungerAlertFor(prev.fome || 0, sheet.fome || 0) ?? hungerAlert;
      }
      set({ hungerAlert, sheet });
      if (owner) {
        sync.schedule(Object.keys(partial));
      }
    },
    sheet: blankSheet(),
  })
);

export function useSheet(): Sheet {
  return useCharacterStore((s) => s.sheet);
}

export function patchSheet(partial: Partial<Sheet>): void {
  useCharacterStore.getState().patch(partial);
}

/** Envia já as mudanças pendentes da ficha. */
export function flushSheet(options?: { keepalive?: boolean }): Promise<void> {
  return sync.flush(options);
}
