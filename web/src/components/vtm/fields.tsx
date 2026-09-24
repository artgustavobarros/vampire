import type { VariantProps } from "class-variance-authority";
import { type ComponentProps, useId } from "react";
import { fieldVariants, Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import type { TextFieldDef } from "#/data/fields";
import { patchSheet, useSheet } from "#/lib/store";
import { cn } from "#/lib/utils";
import { FieldLabel } from "./text";

/** `<select>` nativo com o visual de campo do standalone. */
export function NativeSelect({
  className,
  state,
  ...props
}: ComponentProps<"select"> & VariantProps<typeof fieldVariants>) {
  return (
    <select className={cn(fieldVariants({ state }), className)} {...props} />
  );
}

/** Campo de texto ligado a uma chave da ficha, com salvamento imediato. */
export function SheetTextField({
  field,
  labelClassName,
  inputClassName,
}: {
  field: TextFieldDef;
  labelClassName?: string;
  inputClassName?: string;
}) {
  const sheet = useSheet();
  const id = useId();
  return (
    <div>
      <FieldLabel className={cn("mb-1", labelClassName)} htmlFor={id}>
        {field.label}
      </FieldLabel>
      <Input
        className={inputClassName}
        id={id}
        onChange={(e) => patchSheet({ [field.key]: e.target.value })}
        placeholder={field.placeholder}
        value={sheet[field.key] ?? ""}
      />
    </div>
  );
}

export function SheetTextArea({
  field,
  rows = 5,
}: {
  field: TextFieldDef;
  rows?: number;
}) {
  const sheet = useSheet();
  const id = useId();
  return (
    <>
      <FieldLabel className="mb-3 text-ink" htmlFor={id}>
        {field.label}
      </FieldLabel>
      <Textarea
        id={id}
        onChange={(e) => patchSheet({ [field.key]: e.target.value })}
        placeholder={field.placeholder}
        rows={rows}
        value={sheet[field.key] ?? ""}
      />
    </>
  );
}
