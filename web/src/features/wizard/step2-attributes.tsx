import { TraitGrid } from "#/components/vtm/trait-grid";
import { ATTRIBUTE_GROUPS } from "#/data/traits";
import { patchSheet, useSheet } from "#/lib/store";
import { cn } from "#/lib/utils";
import { vitalityMax, willpowerMax } from "#/rules/tracks";
import { attributeQuotas } from "#/rules/wizard";

const QUOTA_COLOR = {
  done: "text-moss",
  over: "text-blood",
  pending: "text-ink-soft",
} as const;

export function Step2Attributes() {
  const sheet = useSheet();
  const { quotas, summary } = attributeQuotas(sheet.attrs);
  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2">
        {quotas.map((q) => (
          <div
            className={cn(
              "min-w-24 border bg-wash p-3",
              q.state === "over" ? "border-blood" : "border-line"
            )}
            key={q.level}
          >
            <div className="font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-widest">
              {q.label}
            </div>
            <div
              className={cn(
                "mt-2 font-label font-semibold text-2xl leading-none",
                QUOTA_COLOR[q.state]
              )}
            >
              {q.remaining}/{q.target}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-6 text-base opacity-70">
        Todos começam com 2. Escolha um atributo para 4, três para 3 e um para
        1; os quatro restantes ficam em 2. {summary}
      </div>
      <TraitGrid
        groups={ATTRIBUTE_GROUPS}
        minColumn={232}
        onChange={(name, v) =>
          patchSheet({ attrs: { ...sheet.attrs, [name]: v } })
        }
        strongLabels
        values={sheet.attrs}
      />
      <div className="mt-5 border-line border-t pt-3 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-widest">
        Vitalidade {vitalityMax(sheet)} · Força de Vontade {willpowerMax(sheet)}
      </div>
    </>
  );
}
