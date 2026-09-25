import { Controller } from "react-hook-form";
import { FieldLegend, FieldSet } from "#/components/ui/field";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { TraitGrid } from "#/components/vtm/trait-grid";
import { ATTRIBUTE_GROUPS } from "#/data/traits";
import { cn } from "#/lib/utils";
import { vitalityMax, willpowerMax } from "#/rules/tracks";
import { attributeQuotas } from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

const QUOTA_COLOR = {
  done: "text-moss",
  over: "text-blood",
  pending: "text-ink-soft",
} as const;

export function Step2Attributes() {
  const { control } = useWizardForm();
  return (
    <Controller
      control={control}
      name="attrs"
      render={({ field, fieldState }) => {
        const attrs = field.value;
        const { quotas, summary } = attributeQuotas(attrs);
        const vit = vitalityMax({ attrs });
        const vontade = willpowerMax({ attrs });
        return (
          <FieldSet
            className="outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">Atributos</FieldLegend>
            <div className="flex flex-wrap gap-2">
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
            <div className="mb-3 text-base opacity-70">
              Todos começam com 2. Escolha um atributo para 4, três para 3 e um
              para 1; os quatro restantes ficam em 2. {summary}
            </div>
            <TraitGrid
              groups={ATTRIBUTE_GROUPS}
              infoKind="attr"
              minColumn={232}
              onChange={(name, v) => field.onChange({ ...attrs, [name]: v })}
              strongLabels
              values={attrs}
            />
            <div className="mt-2 border-line border-t pt-3 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-widest">
              <InfoTrigger
                target={{ atual: `Máximo ${vit}`, kind: "vitalidade" }}
              >
                Vitalidade
              </InfoTrigger>{" "}
              {vit} ·{" "}
              <InfoTrigger
                target={{ atual: `Máximo ${vontade}`, kind: "vontade" }}
              >
                Força de Vontade
              </InfoTrigger>{" "}
              {vontade}
            </div>
          </FieldSet>
        );
      }}
    />
  );
}
