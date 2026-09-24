import { useCharacterStore } from "./character-store";
import { usePlayerStore } from "./player-store";

/** Volta os stores ao estado inicial (só para testes). */
export function resetStores(): void {
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
  useCharacterStore.setState(useCharacterStore.getInitialState(), true);
}
