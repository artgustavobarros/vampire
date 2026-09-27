import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "#/lib/utils";

/** Abas em controle segmentado (ex.: "Atributos | Habilidades"). */
export function SegmentedTabs(
  props: ComponentProps<typeof TabsPrimitive.Root>
) {
  return <TabsPrimitive.Root {...props} />;
}

export function SegmentedTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-1 border border-line bg-wash p-1",
        className
      )}
      {...props}
    />
  );
}

/** Aba ativa em papel branco com texto tinta; inativa em texto suave. */
export function SegmentedTabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "min-h-11 cursor-pointer px-3 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em] transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-ink data-[state=active]:bg-field data-[state=active]:text-ink data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function SegmentedTabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4",
        className
      )}
      {...props}
    />
  );
}
