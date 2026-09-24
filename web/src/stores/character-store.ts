import { create } from "zustand";
import { blankSheet, normalizeSheet } from "#/lib/sheet";
import { readSheetRaw, writeSheet } from "#/lib/storage";
import type { Sheet } from "#/lib/types";
import { hungerAlertFor } from "#/rules/hunger";

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
  load: (email: string) => void;
  /** Mescla, salva e sinaliza o alerta de Fome como o `patch` do standalone. */
  patch: (partial: Partial<Sheet>) => void;
}

export const useCharacterStore = create<CharacterState & CharacterActions>()(
  (set, get) => ({
    clear() {
      set({ hungerAlert: null, owner: null, sheet: blankSheet() });
    },
    dismissHungerAlert() {
      set({ hungerAlert: null });
    },
    hungerAlert: null,
    load(email) {
      set({
        hungerAlert: null,
        owner: email,
        sheet: normalizeSheet(readSheetRaw(email)),
      });
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
      if (owner) {
        writeSheet(owner, sheet);
      }
      set({ hungerAlert, sheet });
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
