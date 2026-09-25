import { Controller, useWatch } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "#/components/ui/field";
import { NativeSelect } from "#/components/vtm/fields";
import { PowerCard } from "#/components/vtm/power-card";
import { POWERS, type PowerTemplate } from "#/data/disciplines";
import { notify } from "#/lib/toast";
import { cn } from "#/lib/utils";
import {
  addPower,
  clanDisciplineOptions,
  disciplineDistribution,
  powerLimitHint,
  powerToggleBlock,
  toPower,
  trimPowers,
} from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

export function Step5Disciplines() {
  const { control } = useWizardForm();
  const [cla, disc] = useWatch({ control, name: ["cla", "disc"] });
  const { aviso, kind, options } = clanDisciplineOptions(cla);
  const status = disciplineDistribution(disc, cla);
  return (
    <>
      <div className="mb-2 text-base text-ink-soft">{aviso}</div>
      {kind !== "thin" && (
        <>
          {[0, 1].map((i) => (
            <DisciplineRow index={i} key={i} options={options} />
          ))}
          <div
            className={cn(
              "mt-4 font-label font-semibold text-xs uppercase leading-snug tracking-widest",
              status.ok ? "text-moss" : "text-ink-soft"
            )}
          >
            {status.message}
          </div>
        </>
      )}
    </>
  );
}

function DisciplineRow({
  index,
  options,
}: {
  index: number;
  options: readonly string[];
}) {
  const { control, getValues, setValue } = useWizardForm();
  const other = index === 0 ? 1 : 0;
  const [nome, nivel, otherName] = useWatch({
    control,
    name: [`disc.${index}.nome`, `disc.${index}.nivel`, `disc.${other}.nome`],
  });
  const level = nivel || 0;
  const choices = options.filter((o) => o !== otherName);
  // uma disciplina gravada de fora do clã aparece como slot vazio
  const shown = choices.includes(nome) ? nome : "";
  const catalog = POWERS[shown] ?? [];
  const cap = Math.max(level, 1);
  const label = index === 0 ? "Primeira Disciplina" : "Segunda Disciplina";

  return (
    <FieldSet className="mt-4 border-line border-b py-4">
      <FieldLegend>{label}</FieldLegend>
      <div className="flex flex-wrap items-center gap-3">
        <Controller
          control={control}
          name={`disc.${index}.nome`}
          render={({ field, fieldState }) => (
            <Field
              className="min-w-45 flex-1"
              data-invalid={fieldState.invalid}
            >
              <NativeSelect
                {...field}
                aria-invalid={fieldState.invalid}
                aria-label={label}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  // poderes são do catálogo da disciplina anterior
                  setValue(`disc.${index}.powers`, []);
                }}
                value={shown}
              >
                <option value="">— escolher disciplina —</option>
                {choices.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          )}
        />
        <Controller
          control={control}
          name={`disc.${index}.nivel`}
          render={({ field, fieldState }) => (
            <Field className="w-auto" data-invalid={fieldState.invalid}>
              <LevelButtons
                label={label}
                onPick={(mine) => {
                  // distribuição 2 + 1: o outro slot fica com o complemento
                  field.onChange(mine);
                  setValue(`disc.${other}.nivel`, 3 - mine);
                  // cada ponto dá direito a um poder: corta o que não cabe mais
                  setValue(
                    `disc.${index}.powers`,
                    trimPowers(getValues(`disc.${index}.powers`), mine)
                  );
                  setValue(
                    `disc.${other}.powers`,
                    trimPowers(getValues(`disc.${other}.powers`), 3 - mine)
                  );
                }}
                value={field.value || 0}
              />
            </Field>
          )}
        />
      </div>
      {shown && catalog.length > 0 && (
        <Controller
          control={control}
          name={`disc.${index}.powers`}
          render={({ field, fieldState }) => {
            const chosen = new Set(field.value.map((p) => p.nome));
            const toggle = (p: PowerTemplate) => {
              if (chosen.has(p.name)) {
                field.onChange(field.value.filter((x) => x.nome !== p.name));
                return;
              }
              const block = powerToggleBlock(shown, level, field.value.length);
              if (block) {
                notify(block.msg, { titulo: block.titulo, tom: "info" });
                return;
              }
              field.onChange(addPower(field.value, toPower(p)));
            };
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldDescription className="mt-3">
                  {powerLimitHint(level, field.value.length)}
                </FieldDescription>
                <div className="flex flex-wrap gap-2">
                  {catalog
                    .filter((p) => p.level <= cap || chosen.has(p.name))
                    .map((p) => (
                      <PowerCard
                        disc={shown}
                        key={p.name}
                        onToggle={() => toggle(p)}
                        power={p}
                        selected={chosen.has(p.name)}
                      />
                    ))}
                </div>
              </Field>
            );
          }}
        />
      )}
    </FieldSet>
  );
}

/** "+2" ou "+1": o botão escolhido define o nível do slot; clicar no ativo não muda nada. */
function LevelButtons({
  label,
  value,
  onPick,
}: {
  label: string;
  value: number;
  onPick: (level: 1 | 2) => void;
}) {
  return (
    <fieldset
      aria-label={`Nível ${label}`}
      className="m-0 flex gap-2 border-0 p-0"
    >
      {([2, 1] as const).map((n) => (
        <button
          aria-label={`${label} +${n}`}
          aria-pressed={value === n}
          className={cn(
            "cursor-pointer border px-3 py-2 text-base leading-tight focus-visible:outline-2 focus-visible:outline-ink",
            value === n
              ? "border-moss bg-field"
              : "border-ink/20 bg-transparent"
          )}
          key={n}
          onClick={() => value !== n && onPick(n)}
          type="button"
        >
          +{n}
        </button>
      ))}
    </fieldset>
  );
}
