import { useEffect, useState } from "react";
import { store, useAppState } from "#/lib/store";

const MIN_BOOT_MS = 600;
let bootShown = false;

/** Restaura a sessão no cliente e segura a abertura por no mínimo 600ms na primeira carga. */
export function useBoot(): boolean {
  const { ready } = useAppState();
  const [elapsed, setElapsed] = useState(bootShown);
  useEffect(() => {
    store.restore();
    if (bootShown) {
      return;
    }
    const t = setTimeout(() => {
      bootShown = true;
      setElapsed(true);
    }, MIN_BOOT_MS);
    return () => clearTimeout(t);
  }, []);
  return !(ready && elapsed);
}
