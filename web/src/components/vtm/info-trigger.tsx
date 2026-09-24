import type { ComponentProps } from "react";
import type { InfoTarget } from "#/features/info/build-info";
import { useInfo } from "#/features/info/info-sheet";
import { cn } from "#/lib/utils";

interface TriggerProps
  extends Omit<ComponentProps<"button">, "onClick" | "type"> {
  target: InfoTarget;
}

/** Texto que abre o painel de descrição: sem sublinhado, Blood no hover (Ember sobre fundo tinta). */
export function InfoTrigger({
  target,
  onDark,
  className,
  ...props
}: TriggerProps & { onDark?: boolean }) {
  const info = useInfo();
  return (
    <button
      className={cn(
        "cursor-pointer text-left no-underline transition-colors duration-150 ease-in-out [text-transform:inherit] focus-visible:outline-2 focus-visible:outline-current",
        onDark ? "hover:text-ember" : "hover:text-blood",
        className
      )}
      onClick={() => info.open(target)}
      type="button"
      {...props}
    />
  );
}

/** Botão "?" 40×40 ao lado de disciplinas e méritos. */
export function InfoButton({
  target,
  className,
  "aria-label": label,
  ...props
}: TriggerProps) {
  const info = useInfo();
  return (
    <button
      aria-label={label}
      className={cn(
        "grid size-10 flex-none cursor-pointer place-items-center border border-line font-label font-semibold text-ink-soft text-sm leading-none transition-colors duration-150 ease-in-out hover:border-blood hover:text-blood focus-visible:outline-2 focus-visible:outline-ink",
        className
      )}
      onClick={() => info.open(target)}
      type="button"
      {...props}
    >
      ?
    </button>
  );
}
