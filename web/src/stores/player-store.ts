import { create } from "zustand";
import {
  ApiError,
  type ApiUser,
  getSheet,
  getToken,
  me,
  type Role,
  setToken,
} from "#/lib/api";
import { apiError } from "#/lib/toast";
import { ownerOf, useCharacterStore } from "./character-store";

export interface PlayerState {
  name: string | null;
  /** sessão já foi restaurada (só acontece no cliente) */
  ready: boolean;
  /** `dm` = Mestre, sem ficha própria */
  role: Role | null;
  /** e-mail do jogador */
  user: string | null;
  username: string | null;
}

export interface PlayerActions {
  /** Entra como `user` com a ficha já buscada na API (ignorada para o Mestre). */
  login: (user: ApiUser, sheet: unknown) => void;
  logout: () => void;
  /** Restaura a sessão pelo token salvo. Chamado no cliente, depois da hidratação. */
  restore: () => Promise<void>;
  /** A própria conta salva na página "Conta"; o papel não muda. */
  setAccount: (user: ApiUser) => void;
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
        set({
          name: user.name,
          role: user.role,
          user: user.email,
          username: user.username,
        });
        if (user.role === "dm") {
          useCharacterStore.getState().clear();
        } else {
          useCharacterStore.getState().load(ownerOf(user), sheet);
        }
      },
      logout() {
        set({ name: null, role: null, user: null, username: null });
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
      role: null,
      setAccount(user) {
        set({ name: user.name, user: user.email, username: user.username });
      },
      user: null,
      username: null,
    };
  }
);
