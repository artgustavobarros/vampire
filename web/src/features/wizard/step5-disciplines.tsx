import { Controller, useWatch } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "#/components/ui/field";
import { DotRating } from "#/components/vtm/dot-rating";
import { NativeSelect } from "#/components/vtm/fields";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { POWERS, type PowerTemplate } from "#/data/disciplines";
import { notify } from "#/lib/toast";
import type { Power } from "#/lib/types";
import { cn } from "#/lib/utils";

import { powerLimitHint, powerToggleBlock, trimPowers } from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

const toPower = (p: PowerTemplate): Power => ({
  custo: p.cost,
  desc: p.description,
  duracao: p.duration,
  nivel: p.level,
  nome: p.name,
  rouse: p.rouse,
});

export function DisciplineRow({
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
  const catalog = POWERS[nome.trim()] ?? [];
  const cap = Math.max(level, 1);
  const label = index === 0 ? "Primeira Disciplina" : "Segunda Disciplina";
  const choices = options.filter((o) => o !== otherName);
  // uma disciplina gravada de fora do clã continua visível até ser trocada
  if (nome && !choices.includes(nome)) {
    choices.push(nome);
  }

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
              <DotRating
                count={2}
                label={`Nível ${label}`}
                onChange={(v) => {
                  // distribuição 2 + 1: o outro slot fica com o complemento
                  const mine = v >= 2 ? 2 : 1;
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
      {nome && catalog.length > 0 && (
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
              const block = powerToggleBlock(nome, level, field.value.length);
              if (block) {
                notify(block.msg, { titulo: block.titulo, tom: "info" });
                return;
              }
              const powers = [...field.value, toPower(p)];
              powers.sort((x, y) => (x.nivel || 1) - (y.nivel || 1));
              field.onChange(powers);
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
                        disc={nome}
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

/** Cartão de poder: o cartão todo alterna a escolha; o nome abre o painel do poder. */
function PowerCard({
  disc,
  power,
  selected,
  onToggle,
}: {
  disc: string;
  power: PowerTemplate;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "relative min-h-12 max-w-70 border p-3",
        selected
          ? "border-ink bg-ink text-white"
          : "border-line bg-transparent text-ink"
      )}
    >
      <InfoTrigger
        className="relative z-10 inline-block font-label font-semibold text-xs leading-tight"
        onDark={selected}
        target={{ disc, key: power.name, kind: "poder", nivel: power.level }}
      >
        {power.name}
      </InfoTrigger>
      {/* camada que estende o clique ao cartão todo, abaixo do nome */}
      <button
        aria-label={`${selected ? "Remover" : "Incluir"} ${power.name}`}
        aria-pressed={selected}
        className="block cursor-pointer text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-ink focus-visible:after:outline-offset-2"
        onClick={onToggle}
        type="button"
      >
        <span className="mt-0.5 block text-sm leading-snug opacity-70">
          Nível {power.level} · {power.cost}
        </span>
      </button>
    </div>
  );
}
