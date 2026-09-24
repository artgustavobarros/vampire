import { Controller, useWatch } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { NativeSelect } from "#/components/vtm/fields";
import { autoFit } from "#/components/vtm/trait-grid";
import { REQUIRED_SPECIALTY_SKILLS, SKILLS } from "#/data/traits";
import { useWizardForm } from "./form-fields";

/** Troca a especialidade principal (posição 0), mantendo as demais. */
function withPrimary(current: string[] | undefined, text: string): string[] {
  const next = (current ?? []).slice();
  next[0] = text;
  return next.filter((v, i) => i === 0 || v);
}

function SpecialtyField({
  skill,
  label,
  placeholder,
}: {
  skill: string;
  label: string;
  placeholder: string;
}) {
  const { control } = useWizardForm();
  const id = `wizard-espec-${skill}`;
  return (
    <Controller
      control={control}
      defaultValue={[]}
      name={`espec.${skill}`}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            aria-invalid={fieldState.invalid}
            id={id}
            name={field.name}
            onBlur={field.onBlur}
            onChange={(e) =>
              field.onChange(withPrimary(field.value, e.target.value))
            }
            placeholder={placeholder}
            ref={field.ref}
            value={field.value?.[0] ?? ""}
          />
        </Field>
      )}
    />
  );
}

export function Step4Specialties() {
  const { control } = useWizardForm();
  const [skills, especLivre] = useWatch({
    control,
    name: ["skills", "especLivre"],
  });
  const required = REQUIRED_SPECIALTY_SKILLS.filter(
    (k) => (skills[k] || 0) > 0
  );
  const withDots = SKILLS.filter((k) => (skills[k] || 0) > 0);

  if (required.length) {
    return (
      <FieldGroup>
        {required.map((name) => (
          <SpecialtyField
            key={name}
            label={`${name} · nível ${skills[name]}`}
            placeholder="Qual especialidade?"
            skill={name}
          />
        ))}
      </FieldGroup>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-4" style={autoFit(220)}>
      <Controller
        control={control}
        name="especLivre"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="wizard-especLivre">Perícia</FieldLabel>
            <NativeSelect
              {...field}
              aria-invalid={fieldState.invalid}
              id="wizard-especLivre"
            >
              <option value="">— escolher perícia —</option>
              {withDots.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </NativeSelect>
          </Field>
        )}
      />
      {especLivre ? (
        <SpecialtyField
          key={especLivre}
          label="Especialidade"
          placeholder="ex. Interrogatório"
          skill={especLivre}
        />
      ) : (
        <Field data-disabled>
          <FieldLabel htmlFor="wizard-espec-livre">Especialidade</FieldLabel>
          <Input
            disabled
            id="wizard-espec-livre"
            placeholder="Escolha a perícia primeiro"
          />
        </Field>
      )}
    </div>
  );
}
