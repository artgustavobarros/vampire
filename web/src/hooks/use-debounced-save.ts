import { useCallback, useEffect, useRef } from "react";
import { ApiError } from "#/lib/api";
import { apiErrorMessage, notify } from "#/lib/toast";

/** Espera sem novas mudanças antes de gravar. */
export const DEBOUNCE_MS = 500;

type Save<T> = (value: T, options: { keepalive?: boolean }) => Promise<unknown>;

/**
 * Grava o último valor agendado depois de `delay` ms sem mudanças. O que
 * estiver pendente é enviado ao desmontar e no `pagehide` (com `keepalive`).
 * Falha vira toast "Não salvou" com "Tentar de novo".
 */
export function useDebouncedSave<T>(save: Save<T>, delay = DEBOUNCE_MS) {
  const saveRef = useRef(save);
  saveRef.current = save;
  const pending = useRef<{ value: T } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flush = useCallback((keepalive?: boolean) => {
    clearTimeout(timer.current);
    timer.current = undefined;
    const next = pending.current;
    if (next === null) {
      return;
    }
    pending.current = null;
    saveRef.current(next.value, { keepalive }).catch((err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        return;
      }
      // o que mudou depois vale mais que o que falhou
      pending.current ??= next;
      notify(apiErrorMessage(err), {
        acao: "Tentar de novo",
        duracao: 0,
        onAcao: () => flush(),
        titulo: "Não salvou",
      });
    });
  }, []);

  const schedule = useCallback(
    (value: T) => {
      pending.current = { value };
      clearTimeout(timer.current);
      timer.current = setTimeout(() => flush(), delay);
    },
    [delay, flush]
  );

  useEffect(() => {
    const onHide = () => flush(true);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      flush(true);
    };
  }, [flush]);

  return { flush, schedule };
}
