import { create } from "zustand";
import { readPlayerName, readSession } from "#/lib/storage";
import { useCharacterStore } from "./character-store";

export interface PlayerState {
  name: string | null;
  /** sessão já foi lida do armazenamento (só acontece no cliente) */
  ready: boolean;
  user: string | null;
}

export interface PlayerActions {
  /** Entra como `email` e carrega a ficha dele. */
  login: (email: string) => void;
  logout: () => void;
  /** Lê a sessão salva. Chamado uma vez no cliente, depois da hidratação. */
  restore: () => void;
}

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  (set, get) => ({
    login(email) {
      set({ name: readPlayerName(email), user: email });
      useCharacterStore.getState().load(email);
    },
    logout() {
      set({ name: null, user: null });
      useCharacterStore.getState().clear();
    },
    name: null,
    ready: false,
    restore() {
      if (get().ready) {
        return;
      }
      const user = readSession();
      if (user) {
        get().login(user);
      }
      set({ ready: true });
    },
    user: null,
  })
);
