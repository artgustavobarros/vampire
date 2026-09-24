import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit, TraitGrid } from "#/components/vtm/trait-grid";
import { SKILL_DISTRIBUTIONS } from "#/data/distributions";
import { SKILL_GROUPS } from "#/data/traits";
import { patchSheet, useSheet } from "#/lib/store";
import { cn } from "#/lib/utils";
import { distributionSummary, skillDistributionProgress } from "#/rules/wizard";

export function Step3Skills() {
  const sheet = useSheet();
  return (
    <>
      <div className="mb-2 grid gap-2" style={autoFit(200)}>
        {SKILL_DISTRIBUTIONS.map((d) => (
          <SelectableCard
            key={d.name}
            onClick={() => patchSheet({ dist: d.name })}
            selected={sheet.dist === d.name}
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
      <div className="mb-5 flex flex-wrap gap-4 border-line border-b pt-3 pb-5">
        {skillDistributionProgress(sheet).map((l) => (
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
      </div>
      <TraitGrid
        groups={SKILL_GROUPS}
        minColumn={248}
        onChange={(name, v) =>
          patchSheet({ skills: { ...sheet.skills, [name]: v } })
        }
        strongLabels
        values={sheet.skills}
      />
    </>
  );
}
