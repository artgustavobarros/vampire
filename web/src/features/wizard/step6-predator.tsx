import { Controller, useWatch } from "react-hook-form";
import { FieldLegend, FieldSet } from "#/components/ui/field";
import { DotRating } from "#/components/vtm/dot-rating";
import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit } from "#/components/vtm/trait-grid";
import {
  findPredator,
  PREDATORS,
  type PredatorAdjustment,
} from "#/data/predators";
import { cn } from "#/lib/utils";
import { choiceOptionLabel, choiceTotal } from "#/rules/predator";
import { isThinBlood } from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

type Choice = Extract<PredatorAdjustment, { kind: "escolha" }>;

/** Cor da borda de cada ajuste: custo em sangue, ganho em verde. */
function adjustmentTone(a: PredatorAdjustment): string {
  switch (a.kind) {
    case "humanidade":
    case "potencia":
      return a.valor < 0 ? "border-l-blood" : "border-l-moss";
    case "merito":
    case "escolha":
      return a.tipo === "defeito" ? "border-l-blood" : "border-l-moss";
    default:
      return "border-l-blood";
  }
}

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest text-ink/60";

export function Step6Predator() {
  const { control, setValue } = useWizardForm();
  const [cla, predador, predEspec, predDisc] = useWatch({
    control,
    name: ["cla", "predador", "predEspec", "predDisc"],
  });
  if (isThinBlood(cla)) {
    return (
      <div className="border border-line bg-wash p-4 text-base">
        Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo.
      </div>
    );
  }
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
                      setValue("predEscolhas", {});
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
            {predator.adjustments.map((a) => (
              <div
                className={cn(
                  "border-l-2 py-1 pl-3 text-base",
                  adjustmentTone(a)
                )}
                key={a.label}
              >
                {a.label}
                {a.kind === "escolha" && <ChoicePicker choice={a} />}
              </div>
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
          <FieldLegend className="mb-4">{label}</FieldLegend>
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

/** Seletor de um ajuste com escolha: uma opção ou pontos divididos. */
function ChoicePicker({ choice }: { choice: Choice }) {
  const { control } = useWizardForm();
  return (
    <Controller
      control={control}
      defaultValue={{}}
      name={`predEscolhas.${choice.id}`}
      render={({ field, fieldState }) => {
        const picked = field.value ?? {};
        return (
          <FieldSet
            className="mt-2 gap-2 outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">{choice.label}</FieldLegend>
            {choice.modo === "uma" ? (
              <div className="flex flex-wrap gap-2">
                {choice.opcoes.map((o) => {
                  const on = (picked[o.nome] || 0) > 0;
                  return (
                    <button
                      aria-pressed={on}
                      className={cn(
                        "cursor-pointer border px-3 py-2 text-base leading-tight focus-visible:outline-2 focus-visible:outline-ink",
                        on
                          ? "border-moss bg-field"
                          : "border-ink/20 bg-transparent"
                      )}
                      key={o.nome}
                      onClick={() =>
                        field.onChange({ [o.nome]: choice.pontos })
                      }
                      type="button"
                    >
                      {choiceOptionLabel(o)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {choice.opcoes.map((o) => {
                  const others = choiceTotal(picked) - (picked[o.nome] || 0);
                  return (
                    <div className="flex items-center gap-3" key={o.nome}>
                      <span className="w-32">{choiceOptionLabel(o)}</span>
                      <DotRating
                        count={choice.pontos}
                        label={`Pontos em ${o.nome}`}
                        onChange={(v) =>
                          field.onChange({
                            ...picked,
                            [o.nome]: Math.min(v, choice.pontos - others),
                          })
                        }
                        size="sm"
                        value={picked[o.nome] || 0}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </FieldSet>
        );
      }}
    />
  );
}
