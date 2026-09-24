import { Controller, useWatch } from "react-hook-form";
import { FieldLegend, FieldSet } from "#/components/ui/field";
import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit, TraitGrid } from "#/components/vtm/trait-grid";
import { SKILL_DISTRIBUTIONS } from "#/data/distributions";
import { SKILL_GROUPS } from "#/data/traits";
import { cn } from "#/lib/utils";
import { distributionSummary, skillDistributionCheck } from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

export function Step3Skills() {
  const { control } = useWizardForm();
  const [dist, skills] = useWatch({ control, name: ["dist", "skills"] });
  const { lines, stray } = skillDistributionCheck({ dist, skills });
  return (
    <>
      <Controller
        control={control}
        name="dist"
        render={({ field, fieldState }) => (
          <FieldSet
            className="mb-2 outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">Distribuição</FieldLegend>
            <div className="grid gap-2" style={autoFit(200)}>
              {SKILL_DISTRIBUTIONS.map((d) => (
                <SelectableCard
                  key={d.name}
                  onClick={() => field.onChange(d.name)}
                  selected={field.value === d.name}
                >
                  <span className="block font-label font-semibold text-xs uppercase leading-none tracking-[.06em]">
                    {d.name}
                  </span>
                  <span className="mt-2 block text-base leading-snug opacity-70">
                    {d.description}
                  </span>
                  <span className="mt-2 block font-label font-semibold text-xs uppercase leading-tight tracking-[.08em] opacity-60">
                    {distributionSummary(d.targets)}
                  </span>
                </SelectableCard>
              ))}
            </div>
          </FieldSet>
        )}
      />
      <div className="mb-5 flex flex-wrap gap-4 border-line border-b pt-3 pb-5">
        {lines.map((l) => (
          <span
            className={cn(
              "font-label font-semibold text-xs uppercase leading-snug tracking-widest",
              l.done ? "text-moss" : "text-blood"
            )}
            key={l.level}
          >
            Nível {l.level}: {l.current} de {l.target}
          </span>
        ))}
        {stray.length > 0 && (
          <span className="font-label font-semibold text-blood text-xs uppercase leading-snug tracking-widest">
            Fora do formato: {stray.length}
          </span>
        )}
      </div>
      <Controller
        control={control}
        name="skills"
        render={({ field, fieldState }) => (
          <FieldSet
            className="outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">Habilidades</FieldLegend>
            <TraitGrid
              groups={SKILL_GROUPS}
              infoKind="skill"
              minColumn={248}
              onChange={(name, v) =>
                field.onChange({ ...field.value, [name]: v })
              }
              strongLabels
              values={field.value}
            />
          </FieldSet>
        )}
      />
    </>
  );
}
