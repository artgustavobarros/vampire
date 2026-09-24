import { Controller, useWatch } from "react-hook-form";
import { FieldLegend, FieldSet } from "#/components/ui/field";
import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit } from "#/components/vtm/trait-grid";
import { findPredator, PREDATORS } from "#/data/predators";
import { cn } from "#/lib/utils";
import { useWizardForm } from "./form-fields";

const COST = /^−|Defeito|Exige|Perde/;
const GAIN = /^\+|Vantagem|pontos em|Rebanho|Contatos|Fama|Recursos/;

/** Cor da borda de cada ajuste: custo em sangue, ganho em verde. */
function adjustmentTone(text: string): string {
  if (COST.test(text)) {
    return "border-l-blood";
  }
  if (GAIN.test(text)) {
    return "border-l-moss";
  }
  return "border-l-ink/20";
}

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest text-ink/60";

export function Step6Predator() {
  const { control, setValue } = useWizardForm();
  const [predador, predEspec, predDisc] = useWatch({
    control,
    name: ["predador", "predEspec", "predDisc"],
  });
  const predator = findPredator(predador);
  return (
    <>
      <Controller
        control={control}
        name="predador"
        render={({ field, fieldState }) => (
          <FieldSet
            className="outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">Tipo de predador</FieldLegend>
            <div className="grid gap-2" style={autoFit(220)}>
              {PREDATORS.map((p) => (
                <SelectableCard
                  key={p.name}
                  onClick={() => {
                    if (p.name !== field.value) {
                      setValue("predEspec", "");
                      setValue("predDisc", "");
                    }
                    field.onChange(p.name);
                  }}
                  selected={field.value === p.name}
                >
                  <span className="block font-label font-semibold text-xs leading-none tracking-[.02em]">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-base leading-snug opacity-70">
                    {p.description}
                  </span>
                </SelectableCard>
              ))}
            </div>
          </FieldSet>
        )}
      />
      {predator && (
        <div className="mt-5 flex flex-col gap-4 border border-line p-4">
          <OptionGroup
            label="Especialidade — escolha uma"
            name="predEspec"
            options={predator.specialties}
          />
          <OptionGroup
            label="Disciplina — um ponto em uma"
            name="predDisc"
            options={predator.disciplines}
          />
          <div className="flex flex-col gap-2">
            <span className={LABEL}>Ajustes obrigatórios</span>
            {predator.adjustments.map((t) => (
              <span
                className={cn(
                  "border-l-2 py-1 pl-3 text-base",
                  adjustmentTone(t)
                )}
                key={t}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="text-sm opacity-70">
            {predEspec && predDisc
              ? `Predador definido: ${predator.name} · ${predEspec} · +1 ${predDisc}`
              : "Escolha uma especialidade e uma Disciplina para completar o Predador."}
          </div>
        </div>
      )}
    </>
  );
}

function OptionGroup({
  label,
  name,
  options,
}: {
  label: string;
  name: "predEspec" | "predDisc";
  options: readonly string[];
}) {
  const { control } = useWizardForm();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldSet
          className="gap-2 outline-none"
          data-invalid={fieldState.invalid}
          ref={field.ref}
          tabIndex={-1}
        >
          <FieldLegend className="mb-0">{label}</FieldLegend>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                aria-pressed={field.value === o}
                className={cn(
                  "cursor-pointer border px-3 py-2 text-base leading-tight focus-visible:outline-2 focus-visible:outline-ink",
                  field.value === o
                    ? "border-moss bg-field"
                    : "border-ink/20 bg-transparent"
                )}
                key={o}
                onClick={() => field.onChange(o)}
                type="button"
              >
                {o}
              </button>
            ))}
          </div>
        </FieldSet>
      )}
    />
  );
}
