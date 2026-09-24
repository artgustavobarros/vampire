import type { ComponentProps } from "react";
import { cn } from "#/lib/utils";

/** Rótulo Karla em caixa-alta (".22em"), usado em cabeçalhos de cartão e diálogo. */
export function Kicker({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-label font-semibold text-blood text-xs uppercase leading-none tracking-[.22em]",
        className
      )}
      {...props}
    />
  );
}

/** Rótulo de campo ou grupo: Karla 12px, caixa-alta, ".12em". */
export function FieldLabel({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: o controle é passado por htmlFor ou aninhado pelo chamador
    <label
      className={cn(
        "mb-2 block font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]",
        className
      )}
      {...props}
    />
  );
}

/** Título de seção centralizado ("Atributos", "Habilidades"). */
export function SectionTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mt-0 mb-3 text-center font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.22em]",
        className
      )}
      {...props}
    />
  );
}

/** Cartão padrão: superfície com borda fina. */
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("border border-line bg-surface p-4", className)}
      {...props}
    />
  );
}

export function EmptyState({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("my-3 border border-line p-5", className)}>
      <div className="font-label font-semibold text-ink-faint text-xs uppercase leading-none tracking-[.12em]">
        Sem registros
      </div>
      <div className="mt-2 font-semibold text-xl leading-tight">{title}</div>
      <div className="mt-1 max-w-[46ch] text-base text-ink-soft">
        {children}
      </div>
    </div>
  );
}
