import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "#/lib/utils";

export type ToastTom = "erro" | "ok" | "info";

const TOM_COLOR: Record<ToastTom, { border: string; text: string }> = {
  erro: { border: "border-l-blood", text: "text-blood" },
  info: { border: "border-l-ink", text: "text-ink" },
  ok: { border: "border-l-moss", text: "text-moss" },
};

interface VToastProps {
  acao?: string;
  msg: string;
  onAcao?: () => void;
  onClose: () => void;
  titulo: string;
  tom: ToastTom;
}

/** Cartão de aviso V5: Vellum, filete, borda esquerda na cor do tom, sem sombra. */
export function VToast({ tom, titulo, msg, acao, onAcao, onClose }: VToastProps) {
  const color = TOM_COLOR[tom];
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full animate-in items-start gap-3 border border-line border-l-2 bg-surface py-3 pr-3 pl-4 duration-200 ease-out fade-in slide-in-from-bottom-2",
        color.border
      )}
      role="alert"
    >
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]",
            color.text
          )}
        >
          {titulo}
        </div>
        <div className="mt-1 font-serif text-ink text-lg">{msg}</div>
        {acao && onAcao ? (
          <button
            className="mt-2 inline-block cursor-pointer border-ink border-b pt-4 pb-1 font-label font-semibold text-ink text-xs uppercase leading-none tracking-widest"
            onClick={() => {
              onAcao();
              onClose();
            }}
            type="button"
          >
            {acao}
          </button>
        ) : null}
      </div>
      <button
        aria-label="Fechar aviso"
        className="-my-3 -mr-3 grid size-12 flex-none cursor-pointer place-items-center font-serif text-2xl text-ink-soft leading-none"
        onClick={onClose}
        type="button"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Para `onInteractOutside` de diálogos e painéis: tocar num aviso não fecha
 * o modal aberto por baixo dele.
 */
export function ignoreToastInteraction(event: { target: EventTarget | null; preventDefault: () => void }) {
  if (event.target instanceof Element && event.target.closest("[data-sonner-toaster]")) {
    event.preventDefault();
  }
}

interface ToasterExtraProps {
  /** distância do fundo em px (96 na ficha, acima da barra inferior) */
  bottom: number;
}

function Toaster({ bottom, ...props }: ToasterProps & ToasterExtraProps) {
  return (
    <Sonner
      customAriaLabel="Avisos"
      expand
      gap={8}
      mobileOffset={{ bottom, left: 16, right: 16 }}
      offset={{ bottom, right: 24 }}
      position="bottom-right"
      style={{ "--width": "min(420px, calc(100vw - 48px))" } as CSSProperties}
      theme="light"
      toastOptions={{ className: "w-(--width)" }}
      visibleToasts={3}
      {...props}
    />
  );
}

export { Toaster };
