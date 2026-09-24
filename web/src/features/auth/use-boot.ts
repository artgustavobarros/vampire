import { useEffect } from "react";
import { usePlayerStore } from "#/stores/player-store";

/** Restaura a sessão no cliente; retorna `true` enquanto ela não foi lida. */
export function useBoot(): boolean {
  const ready = usePlayerStore((s) => s.ready);
  useEffect(() => {
    usePlayerStore.getState().restore();
  }, []);
  return !ready;
}
