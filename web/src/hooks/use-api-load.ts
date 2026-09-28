import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { apiError } from "#/lib/toast";

/**
 * Carrega da API ao montar; `null` enquanto carrega. Falha vira toast com
 * "Tentar de novo". O `set` deixa a página trocar o dado depois de gravar.
 */
export function useApiLoad<T>(
  load: () => Promise<T>
): [T | null, Dispatch<SetStateAction<T | null>>] {
  const [data, setData] = useState<T | null>(null);
  const [attempt, setAttempt] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `load` é fixo por página; `attempt` só existe para buscar de novo
  useEffect(() => {
    let active = true;
    load()
      .then((value) => {
        if (active) {
          setData(value);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          apiError(err, () => setAttempt((n) => n + 1));
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  return [data, setData];
}
