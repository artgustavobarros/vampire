import { create } from "zustand";
import {
  ApiError,
  type ApiUser,
  getSheet,
  getToken,
  me,
  setToken,
} from "#/lib/api";
import { apiError } from "#/lib/toast";
import { useCharacterStore } from "./character-store";

export interface PlayerState {
  name: string | null;
  /** sessão já foi restaurada (só acontece no cliente) */
  ready: boolean;
  /** e-mail do jogador */
  user: string | null;
}

export interface PlayerActions {
  /** Entra como `user` com a ficha já buscada na API. */
  login: (user: ApiUser, sheet: unknown) => void;
  logout: () => void;
  /** Restaura a sessão pelo token salvo. Chamado no cliente, depois da hidratação. */
  restore: () => Promise<void>;
}

let restoring: Promise<void> | null = null;

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  (set, get) => {
    async function restoreSession(): Promise<void> {
      if (!getToken()) {
        set({ ready: true });
        return;
      }
      try {
        const [user, { sheet }] = await Promise.all([me(), getSheet()]);
        get().login(user, sheet);
        set({ ready: true });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setToken(null);
          set({ ready: true });
          return;
        }
        // sem conexão: a abertura continua até dar certo
        apiError(err, () => {
          get().restore();
        });
      }
    }

    return {
      login(user, sheet) {
        set({ name: user.name, user: user.email });
        useCharacterStore.getState().load(user.email, sheet);
      },
      logout() {
        set({ name: null, user: null });
        useCharacterStore.getState().clear();
      },
      name: null,
      ready: false,
      restore() {
        if (get().ready) {
          return Promise.resolve();
        }
        restoring ??= restoreSession().finally(() => {
          restoring = null;
        });
        return restoring;
      },
      user: null,
    };
  }
);
