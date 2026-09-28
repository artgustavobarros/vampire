import type { ComponentProps } from "react";
import { cn } from "#/lib/utils";

type SelectableCardProps = ComponentProps<"button"> & {
  selected: boolean;
  /** fundo branco quando não selecionado (cartões de clã) */
  filled?: boolean;
};

/** Cartão que inverte para tinta quando selecionado. */
export function SelectableCard({
  selected,
  filled,
  className,
  ...props
}: SelectableCardProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "block min-h-12 w-full cursor-pointer border p-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
        selected
          ? "border-ink bg-ink text-white"
          : cn(
              "border-line text-ink enabled:hover:border-blood",
              filled ? "bg-field" : "bg-transparent"
            ),
        className
      )}
      type="button"
      {...props}
    />
  );
}

type ChipProps = ComponentProps<"button"> & {
  selected: boolean;
  tone?: "ink" | "blood";
};

/** Selo em caixa-alta usado em Ressonância, sugestões de disciplina e "Custa checagem de sangue". */
export function Chip({
  selected,
  tone = "ink",
  className,
  ...props
}: ChipProps) {
  const on =
    tone === "blood"
      ? "border-blood bg-blood text-white"
      : "border-ink bg-ink text-white";
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "flex min-h-10 cursor-pointer items-center border px-4 py-2 font-label font-semibold text-xs uppercase leading-none tracking-widest focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
        selected ? on : "border-line bg-transparent text-ink",
        className
      )}
      type="button"
      {...props}
    />
  );
}
