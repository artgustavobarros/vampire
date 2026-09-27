import { toast } from "sonner";
import { ApiError, patchSheet } from "#/lib/api";
import { apiErrorMessage, notify } from "#/lib/toast";
import type { Sheet } from "#/lib/types";

/** Espera sem novas mudanças antes de enviar. */
export const SAVE_DELAY = 600;

export interface SheetSync {
  /** Envia já as chaves pendentes; espera o envio em andamento antes. */
  flush: (options?: { keepalive?: boolean }) => Promise<void>;
  /** Descarta pendências, envio agendado e resultado de envio em andamento. */
  reset: () => void;
  /** Marca chaves como pendentes e reinicia a espera. */
  schedule: (keys: string[]) => void;
}

/**
 * Grava a ficha na API com um `PATCH` das chaves mudadas, lendo os valores
 * atuais na hora do envio. Um envio por vez; o que muda durante um envio
 * fica pendente para o próximo.
 */
export function createSheetSync(read: () => Sheet): SheetSync {
  const pending = new Set<string>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let inFlight: Promise<void> | null = null;
  /** muda a cada `reset`, para um envio antigo não mexer no estado novo */
  let generation = 0;
  let failToast: string | null = null;

  const cancelTimer = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  async function send(keepalive?: boolean): Promise<void> {
    const keys = [...pending];
    pending.clear();
    const sheet = read() as Record<string, unknown>;
    const patch = Object.fromEntries(keys.map((k) => [k, sheet[k] ?? null]));
    const gen = generation;
    try {
      await patchSheet(patch, { keepalive });
      if (failToast && gen === generation) {
        toast.dismiss(failToast);
        failToast = null;
      }
    } catch (err) {
      // `401` já encerrou a sessão; depois de um `reset` nada mais vale
      if (
        gen !== generation ||
        (err instanceof ApiError && err.status === 401)
      ) {
        return;
      }
      for (const k of keys) {
        pending.add(k);
      }
      failToast = notify(apiErrorMessage(err), {
        acao: "Tentar de novo",
        duracao: 0,
        onAcao: () => {
          flush();
        },
        titulo: "Não salvou",
      });
    }
  }

  async function flush({
    keepalive,
  }: {
    keepalive?: boolean;
  } = {}): Promise<void> {
    cancelTimer();
    if (inFlight) {
      await inFlight;
      return flush({ keepalive });
    }
    if (pending.size === 0) {
      return;
    }
    inFlight = send(keepalive);
    try {
      await inFlight;
    } finally {
      inFlight = null;
    }
  }

  return {
    flush,
    reset() {
      cancelTimer();
      pending.clear();
      generation += 1;
      if (failToast) {
        toast.dismiss(failToast);
        failToast = null;
      }
    },
    schedule(keys) {
      for (const k of keys) {
        pending.add(k);
      }
      cancelTimer();
      timer = setTimeout(() => {
        timer = undefined;
        flush();
      }, SAVE_DELAY);
    },
  };
}
