import { create } from "zustand";
import {
  type ApiUser,
  getPlayerSheet,
  patchSheet as patchMe,
  patchPlayerSheet,
} from "#/lib/api";
import { blankSheet, normalizeSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import { hungerAlertFor } from "#/rules/hunger";
import { createSheetSync } from "./sheet-sync";

/** De quem é a ficha aberta, e portanto para onde ela é gravada. */
export interface SheetOwner {
  email: string;
  name: string;
  /** jogador aberto pelo Mestre (`/sheets/:userId`); ausente = a própria ficha */
  userId?: string;
  username: string;
}

/** O dono a partir do usuário da API; com `userId`, aberto pelo Mestre. */
export function ownerOf(
  { email, name, username }: ApiUser,
  userId?: string
): SheetOwner {
  return userId ? { email, name, userId, username } : { email, name, username };
}

export interface CharacterState {
  /** alerta de Fome pendente (0 ou 5) */
  hungerAlert: 0 | 5 | null;
  /** dono da ficha aberta; sem dono, a ficha fica só em memória */
  owner: SheetOwner | null;
  sheet: Sheet;
}

export interface CharacterActions {
  clear: () => void;
  dismissHungerAlert: () => void;
  /** Carrega a ficha vinda da API (`null` = ainda não existe). */
  load: (owner: SheetOwner, raw: unknown) => void;
  /**
   * Só o Mestre: envia as pendências da ficha aberta e abre a do jogador.
   * Lança o erro da API; uma abertura mais nova descarta a anterior.
   */
  openPlayerSheet: (userId: string) => Promise<void>;
  /** Mescla, agenda a gravação e sinaliza o alerta de Fome como o `patch` do standalone. */
  patch: (partial: Partial<Sheet>) => void;
  /** Conta do dono salva na página "Conta": troca só os dados da conta. */
  setOwnerAccount: (user: ApiUser) => void;
}

const sync = createSheetSync(
  () => useCharacterStore.getState().sheet,
  (patch, options) => {
    // lido na hora do envio: as pendências vão para o dono de quando mudaram,
    // pois trocar de ficha envia tudo antes de trocar o dono
    const userId = useCharacterStore.getState().owner?.userId;
    return userId
      ? patchPlayerSheet(userId, patch, options)
      : patchMe(patch, options);
  }
);

/** muda a cada `openPlayerSheet`, para uma resposta atrasada não vencer */
let opening = 0;

export const useCharacterStore = create<CharacterState & CharacterActions>()(
  (set, get) => ({
    clear() {
      opening += 1;
      sync.reset();
      set({ hungerAlert: null, owner: null, sheet: blankSheet() });
    },
    dismissHungerAlert() {
      set({ hungerAlert: null });
    },
    hungerAlert: null,
    load(owner, raw) {
      sync.reset();
      set({ hungerAlert: null, owner, sheet: normalizeSheet(raw) });
    },
    async openPlayerSheet(userId) {
      opening += 1;
      const current = opening;
      await sync.flush();
      const { sheet, user } = await getPlayerSheet(userId);
      if (current === opening) {
        get().load(ownerOf(user, userId), sheet);
      }
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
    setOwnerAccount(user) {
      const { owner } = get();
      if (owner) {
        // sem `load`: as mudanças pendentes da ficha continuam na fila
        set({ owner: ownerOf(user, owner.userId) });
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
