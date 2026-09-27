import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "#/lib/utils";

type SegmentedControlProps = Omit<
  ComponentProps<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  onValueChange: (value: string) => void;
  value: string;
};

/** Controle segmentado de escolha única (sempre um valor marcado), no visual de `SegmentedTabs`. */
export function SegmentedControl({
  className,
  onValueChange,
  ...props
}: SegmentedControlProps) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-1 border border-line bg-wash p-1",
        className
      )}
      onValueChange={(v) => v && onValueChange(v)}
      type="single"
      {...props}
    />
  );
}

/** Item ativo em papel branco com texto tinta; inativo em texto suave. */
export function SegmentedControlItem({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "min-h-11 cursor-pointer px-1 font-label font-semibold text-ink-soft text-xs leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-ink enabled:hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:bg-field data-[state=on]:text-ink data-[state=on]:shadow-sm",
        className
      )}
      {...props}
    />
  );
}
