import { Controller, useWatch } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "#/components/ui/field";
import { NativeSelect } from "#/components/vtm/fields";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit } from "#/components/vtm/trait-grid";
import { CLANS, findClan } from "#/data/clans";
import { GENERATIONS } from "#/data/generations";
import type { InfoTarget } from "#/features/info/build-info";
import { bloodPotency, potencyNote, sireNote } from "#/rules/generation";
import { keepClanDisciplines } from "#/rules/wizard";
import { useWizardForm, WizardTextField } from "./form-fields";

export function Step1Clan() {
  const { control, getValues, setValue } = useWizardForm();
  const [cla, geracao] = useWatch({ control, name: ["cla", "geracao"] });
  const clan = findClan(cla);
  // a ficha só recebe a potência ao salvar o passo; usa a geração do formulário
  const potencia = bloodPotency({ geracao, potencia: 0 });
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
                  onClick={() => {
                    if (c.name === field.value) {
                      return;
                    }
                    field.onChange(c.name);
                    // Disciplinas do clã anterior deixam de valer
                    setValue(
                      "disc",
                      keepClanDisciplines(getValues("disc"), c.name)
                    );
                  }}
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
          </FieldSet>
        )}
      />
      {clan && (
        <div className="mt-4 grid gap-3" style={autoFit(248)}>
          <ClanTrait
            label="Perdição do clã"
            target={{ key: clan.name, kind: "bane", potencia }}
            text={clan.baneText}
            title={clan.bane}
          />
          <ClanTrait
            label="Compulsão do clã"
            target={{ key: clan.name, kind: "comp", potencia }}
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
                {/* rótulo abre o painel; o select é nomeado por aria-label */}
                <InfoTrigger
                  className="block font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]"
                  target={{ geracao: field.value, kind: "geracao", potencia }}
                >
                  Geração
                </InfoTrigger>
                <NativeSelect
                  {...field}
                  aria-invalid={fieldState.invalid}
                  aria-label="Geração"
                  id="wizard-geracao"
                >
                  <option value="">— Escolher geração —</option>
                  {GENERATIONS.map((g) => (
                    <option key={g.label} value={g.label}>
                      {g.label}
                    </option>
                  ))}
                </NativeSelect>
                <FieldDescription>
                  {potencyNote({ geracao: field.value, potencia: 0 })}
                </FieldDescription>
                <FieldDescription className="-mt-1">
                  {sireNote(field.value)}
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
  target,
  title,
  text,
}: {
  label: string;
  target: InfoTarget;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-line border-l-2 border-l-blood p-3">
      <div className="font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
        {label}
      </div>
      <InfoTrigger
        className="mt-2 block font-semibold text-2xl leading-tight"
        target={target}
      >
        {title}
      </InfoTrigger>
      <div className="mt-1 text-base opacity-70">{text}</div>
    </div>
  );
}
