import { Controller, useWatch } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "#/components/ui/field";
import { NativeSelect } from "#/components/vtm/fields";
import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit } from "#/components/vtm/trait-grid";
import { CLANS, findClan } from "#/data/clans";
import { GENERATIONS } from "#/data/generations";
import { potencyNote } from "#/rules/generation";
import { useWizardForm, WizardTextField } from "./form-fields";

export function Step1Clan() {
  const { control } = useWizardForm();
  const clan = findClan(useWatch({ control, name: "cla" }));
  return (
    <>
      <Controller
        control={control}
        name="cla"
        render={({ field, fieldState }) => (
          <FieldSet
            className="outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">Clã</FieldLegend>
            <div className="grid gap-2" style={autoFit(152)}>
              {CLANS.map((c) => (
                <SelectableCard
                  filled
                  key={c.name}
                  onClick={() => field.onChange(c.name)}
                  selected={field.value === c.name}
                >
                  <span className="block font-label font-semibold text-xs leading-none tracking-[.02em]">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-base opacity-70">
                    {c.disciplines.join(" · ")}
                  </span>
                </SelectableCard>
              ))}
            </div>
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        )}
      />
      {clan && (
        <div className="mt-4 grid gap-3" style={autoFit(248)}>
          <ClanTrait
            label="Perdição do clã"
            text={clan.baneText}
            title={clan.bane}
          />
          <ClanTrait
            label="Compulsão do clã"
            text={clan.compulsionText}
            title={clan.compulsion}
          />
        </div>
      )}
      <div className="mt-6 border-line border-t pt-5">
        <div className="grid gap-x-5 gap-y-4" style={autoFit(220)}>
          <WizardTextField label="Senhor" name="senhor" />
          <Controller
            control={control}
            name="geracao"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="wizard-geracao">Geração</FieldLabel>
                <NativeSelect
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="wizard-geracao"
                >
                  <option value="">— escolher geração —</option>
                  {GENERATIONS.map((g) => (
                    <option key={g.label} value={g.label}>
                      {g.label}
                    </option>
                  ))}
                </NativeSelect>
                <FieldError errors={[fieldState.error]} />
                <FieldDescription>
                  {potencyNote({ geracao: field.value, potencia: 0 })}
                </FieldDescription>
              </Field>
            )}
          />
        </div>
      </div>
    </>
  );
}

function ClanTrait({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-line border-l-2 border-l-blood p-3">
      <div className="font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
        {label}
      </div>
      <div className="mt-2 font-semibold text-2xl leading-tight">{title}</div>
      <div className="mt-1 text-base opacity-70">{text}</div>
    </div>
  );
}
