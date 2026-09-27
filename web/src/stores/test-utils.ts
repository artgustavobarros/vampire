import { setToken } from "#/lib/api";
import { useCharacterStore } from "./character-store";
import { usePlayerStore } from "./player-store";

/** Volta os stores ao estado inicial e esquece o token (só para testes). */
export function resetStores(): void {
  useCharacterStore.getState().clear();
  setToken(null);
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
  useCharacterStore.setState(useCharacterStore.getInitialState(), true);
}
