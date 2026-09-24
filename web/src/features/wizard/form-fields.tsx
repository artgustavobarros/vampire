import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import type { WizardValues } from "./schema";

export function useWizardForm() {
  return useFormContext<WizardValues>();
}

type TextKey = {
  [K in keyof WizardValues]: WizardValues[K] extends string ? K : never;
}[keyof WizardValues];

/** Campo de texto do assistente: rótulo, input e erro do shadcn `Field`. */
export function WizardTextField({
  name,
  label,
  placeholder,
}: {
  name: TextKey;
  label: string;
  placeholder?: string;
}) {
  const { control } = useWizardForm();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`wizard-${name}`}>{label}</FieldLabel>
          <Input
            {...field}
            aria-invalid={fieldState.invalid}
            id={`wizard-${name}`}
            placeholder={placeholder}
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
