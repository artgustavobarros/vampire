import { useEffect } from "react";
import { connectSession } from "#/lib/auth";
import { usePlayerStore } from "#/stores/player-store";

/** Restaura a sessão no cliente; retorna `true` enquanto ela não foi restaurada. */
export function useBoot(): boolean {
  const ready = usePlayerStore((s) => s.ready);
  useEffect(() => {
    connectSession();
    usePlayerStore.getState().restore();
  }, []);
  return !ready;
}
