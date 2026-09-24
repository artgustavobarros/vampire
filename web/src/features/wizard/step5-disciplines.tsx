import { Controller, useWatch } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from "#/components/ui/field";
import { DotRating } from "#/components/vtm/dot-rating";
import { NativeSelect } from "#/components/vtm/fields";
import { SelectableCard } from "#/components/vtm/selectable";
import { findClan } from "#/data/clans";
import { DISCIPLINES, POWERS, type PowerTemplate } from "#/data/disciplines";
import type { Power } from "#/lib/types";
import { bloodPotency, potencyNote } from "#/rules/generation";
import { useWizardForm } from "./form-fields";

const toPower = (p: PowerTemplate): Power => ({
  custo: p.cost,
  desc: p.description,
  duracao: p.duration,
  nivel: p.level,
  nome: p.name,
  rouse: p.rouse,
});

export function Step5Disciplines() {
  const { control } = useWizardForm();
  const [cla, geracao] = useWatch({ control, name: ["cla", "geracao"] });
  const clan = findClan(cla);
  const options = clan
    ? [
        ...clan.disciplines,
        ...DISCIPLINES.filter((n) => !clan.disciplines.includes(n)),
      ]
    : DISCIPLINES;
  const potency = { geracao, potencia: 0 };
  return (
    <>
      {[0, 1].map((i) => (
        <DisciplineRow index={i} key={i} options={options} />
      ))}
      <div className="mt-6 border border-line bg-wash p-3">
        <div className="font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
          Potência de Sangue
        </div>
        <DotRating
          className="mt-3 flex-wrap gap-2"
          count={10}
          label="Potência de Sangue"
          value={bloodPotency(potency)}
        />
        <div className="mt-3 text-sm opacity-70">
          {potencyNote(potency, true)}
        </div>
      </div>
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
  const { control, setValue } = useWizardForm();
  const [nome, nivel] = useWatch({
    control,
    name: [`disc.${index}.nome`, `disc.${index}.nivel`],
  });
  const level = nivel || 0;
  const catalog = POWERS[nome.trim()] ?? [];
  const cap = Math.max(level, 1);
  const label = `Disciplina ${index + 1}`;

  return (
    <FieldSet className="border-line border-b py-4">
      <FieldLegend className="sr-only">{label}</FieldLegend>
      <div className="flex flex-wrap items-start gap-3">
        <Controller
          control={control}
          name={`disc.${index}.nome`}
          render={({ field, fieldState }) => (
            <Field
              className="min-w-[180px] flex-1"
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
              >
                <option value="">— escolher disciplina —</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </NativeSelect>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          control={control}
          name={`disc.${index}.nivel`}
          render={({ field, fieldState }) => (
            <Field className="w-auto" data-invalid={fieldState.invalid}>
              <DotRating
                label={`Nível ${label}`}
                onChange={field.onChange}
                value={field.value || 0}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
      {nome && catalog.length > 0 && (
        <Controller
          control={control}
          name={`disc.${index}.powers`}
          render={({ field, fieldState }) => {
            const chosen = new Set(field.value.map((p) => p.nome));
            const toggle = (p: PowerTemplate) => {
              const powers = chosen.has(p.name)
                ? field.value.filter((x) => x.nome !== p.name)
                : [...field.value, toPower(p)];
              powers.sort((x, y) => (x.nivel || 1) - (y.nivel || 1));
              field.onChange(powers);
            };
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldDescription className="mt-3">
                  {level
                    ? `Poderes disponíveis até o nível ${level} — toque para incluir na ficha.`
                    : "Marque o nível da disciplina; por enquanto só os poderes de nível 1 aparecem."}
                </FieldDescription>
                <div className="flex flex-wrap gap-2">
                  {catalog
                    .filter((p) => p.level <= cap || chosen.has(p.name))
                    .map((p) => (
                      <SelectableCard
                        className="w-auto max-w-[280px]"
                        key={p.name}
                        onClick={() => toggle(p)}
                        selected={chosen.has(p.name)}
                      >
                        <span className="block font-label font-semibold text-xs leading-tight">
                          {p.name}
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug opacity-70">
                          Nível {p.level} · {p.cost}
                        </span>
                      </SelectableCard>
                    ))}
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            );
          }}
        />
      )}
    </FieldSet>
  );
}
