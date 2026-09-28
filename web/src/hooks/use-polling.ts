import { useEffect, useRef } from "react";

/** Intervalo de atualização da Rodada do jogador. */
export const POLL_MS = 5000;

/**
 * Chama `fn` ao montar, a cada `interval` ms enquanto a página está visível
 * e de novo quando ela volta a ficar visível.
 */
export function usePolling(fn: () => void, interval = POLL_MS): void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    fnRef.current();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        fnRef.current();
      }
    }, interval);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fnRef.current();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [interval]);
}
