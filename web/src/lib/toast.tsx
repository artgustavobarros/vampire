import { toast } from "sonner";
import { type ToastTom, VToast } from "#/components/ui/sonner";

export interface NotifyOptions {
  acao?: string;
  /** ms; 0 = só fecha manualmente */
  duracao?: number;
  onAcao?: () => void;
  titulo?: string;
  tom?: ToastTom;
}

const MAX_VISIBLE = 3;
const NETWORK_ERROR = /fetch|network/i;
const DEFAULT_TITLE: Record<ToastTom, string> = {
  erro: "Algo deu errado",
  info: "Aviso",
  ok: "Feito",
};

/** Ordem de chegada dos toasts abertos, para descartar os mais antigos. */
let open: string[] = [];

function forget(id: string | number) {
  open = open.filter((x) => x !== id);
}

/** Mostra um aviso. A mesma mensagem substitui o toast visível em vez de duplicar. */
export function notify(msg: string, opts: NotifyOptions = {}): string {
  const tom = opts.tom ?? "erro";
  const id = `v:${msg}`;
  const ms = opts.duracao ?? (tom === "erro" ? 6000 : 3500);

  open = [...open.filter((x) => x !== id), id];
  while (open.length > MAX_VISIBLE) {
    const oldest = open.shift();
    if (oldest) {
      toast.dismiss(oldest);
    }
  }

  toast.custom(
    () => (
      <VToast
        acao={opts.acao}
        msg={msg}
        onAcao={opts.onAcao}
        onClose={() => {
          forget(id);
          toast.dismiss(id);
        }}
        titulo={opts.titulo ?? DEFAULT_TITLE[tom]}
        tom={tom}
      />
    ),
    {
      duration: ms > 0 ? ms : Number.POSITIVE_INFINITY,
      id,
      onAutoClose: (t) => forget(t.id),
      onDismiss: (t) => forget(t.id),
    }
  );
  return id;
}

function statusOf(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null) {
    return;
  }
  const e = err as { status?: unknown; response?: { status?: unknown } };
  const status = e.status ?? e.response?.status;
  return typeof status === "number" && status > 0 ? status : undefined;
}

function messageOf(err: unknown): string {
  return err instanceof Error || (typeof err === "object" && err !== null)
    ? String((err as { message?: unknown }).message ?? "")
    : "";
}

/** Mensagem para um erro de requisição (Response, Error ou {status, message}). */
export function apiErrorMessage(err: unknown): string {
  const status = statusOf(err);
  const message = messageOf(err);
  let msg = "Não foi possível falar com o servidor. Verifique a conexão.";
  if (status === 401) {
    msg = "Sua sessão expirou. Entre de novo para continuar.";
  } else if (status === 403) {
    msg = message || "Você não tem permissão para fazer isso.";
  } else if (status === 404) {
    msg = message || "Não encontramos o que você pediu.";
  } else if (status === 409) {
    msg = "Essa ficha foi alterada em outro lugar. Recarregue antes de salvar.";
  } else if (status === 400 || status === 422) {
    msg = message || "Algum campo foi recusado. Revise e tente de novo.";
  } else if (status !== undefined && status >= 500) {
    msg = "O servidor falhou ao responder. Nada foi perdido; tente de novo.";
  } else if (message && !NETWORK_ERROR.test(message)) {
    msg = message;
  }
  return msg;
}

/** Traduz um erro de requisição em toast, com "Tentar de novo" quando há `retry`. */
export function apiError(err: unknown, retry?: () => void): string {
  const status = statusOf(err);
  return notify(apiErrorMessage(err), {
    acao: retry ? "Tentar de novo" : undefined,
    onAcao: retry,
    titulo: status ? `Erro ${status}` : "Sem conexão",
  });
}
