import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { Field } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { DotRating } from "#/components/vtm/dot-rating";
import { InfoButton } from "#/components/vtm/info-trigger";
import { EmptyState } from "#/components/vtm/text";
import type { MeritKind } from "#/lib/types";
import { cn } from "#/lib/utils";
import {
  effectiveMeritKind,
  isThinBlood,
  MERIT_TARGETS,
  meritKinds,
  meritStatus,
} from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

const ACTION =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest";

const KIND_LABEL: Record<MeritKind, string> = {
  defeito: "Defeito",
  "defeito-sr": "Defeito SR",
  "qualidade-sr": "Qualidade SR",
  vantagem: "Vantagem",
};

const KIND_BG: Record<MeritKind, string> = {
  defeito: "bg-blood",
  "defeito-sr": "bg-blood",
  "qualidade-sr": "bg-moss",
  vantagem: "bg-moss",
};

const RULE =
  "Distribua 7 pontos em Vantagens e adquira 2 pontos de Defeitos além daqueles obtidos do seu Tipo de Predador.";
const THIN_RULE =
  " Sangues-ralos devem adquirir entre uma e três Qualidades de Sangue-Ralo e a mesma quantidade de Defeitos de Sangue-Ralo.";

export function Step7Merits() {
  const { control } = useWizardForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "meritos",
  });
  const [cla, meritos] = useWatch({ control, name: ["cla", "meritos"] });
  const thin = isThinBlood(cla);
  const kinds = meritKinds(cla);
  const status = meritStatus(meritos, cla);
  const { totals } = status;

  return (
    <>
      <div className={cn(ACTION, "mb-3 flex flex-wrap gap-4 text-ink-soft")}>
        <span>
          {totals.vantagens}/{MERIT_TARGETS.vantagens} pts em vantagens
        </span>
        <span>
          {totals.defeitos}/{MERIT_TARGETS.defeitos} pts em defeitos
        </span>
        {thin && (
          <span>
            {totals.qualidadesSR} qualidades · {totals.defeitosSR} defeitos de
            sangue-ralo
          </span>
        )}
      </div>
      <div className="mb-2 max-w-[60ch] text-base text-ink-soft">
        {RULE}
        {thin && THIN_RULE}
      </div>
      <div
        className={cn(
          ACTION,
          "mb-3 leading-snug",
          status.ok ? "text-moss" : "text-ink-soft"
        )}
      >
        {status.message}
      </div>
      {fields.map((row, i) => (
        <div
          className="flex flex-wrap items-start gap-3 border-line-soft border-b py-2"
          key={row.id}
        >
          <Controller
            control={control}
            name={`meritos.${i}.tipo`}
            render={({ field }) => {
              const tipo = effectiveMeritKind(field.value, cla);
              return (
                <button
                  className={cn(
                    ACTION,
                    "mt-2 cursor-pointer whitespace-nowrap px-2 py-1 text-white",
                    KIND_BG[tipo]
                  )}
                  onClick={() =>
                    field.onChange(
                      kinds[(kinds.indexOf(tipo) + 1) % kinds.length]
                    )
                  }
                  title="Alternar tipo"
                  type="button"
                >
                  {KIND_LABEL[tipo]}
                </button>
              );
            }}
          />
          <Controller
            control={control}
            name={`meritos.${i}.nome`}
            render={({ field, fieldState }) => (
              <Field
                className="min-w-[140px] flex-1"
                data-invalid={fieldState.invalid}
              >
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  aria-label="Nome"
                  placeholder="Nome"
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name={`meritos.${i}.pontos`}
            render={({ field, fieldState }) => (
              <Field className="mt-3 w-auto" data-invalid={fieldState.invalid}>
                <DotRating
                  label={`Pontos de ${meritos[i]?.nome || "linha"}`}
                  onChange={field.onChange}
                  size="sm"
                  value={field.value}
                />
              </Field>
            )}
          />
          <InfoButton
            aria-label={`Sobre ${meritos[i]?.nome || "esta linha"}`}
            className="mt-1"
            target={{
              key: meritos[i]?.nome ?? "",
              kind: "merit",
              pontos: meritos[i]?.pontos ?? 0,
              tipo: effectiveMeritKind(meritos[i]?.tipo ?? "vantagem", cla),
            }}
          />
          <button
            className={cn(ACTION, "mt-4 cursor-pointer text-ink/55")}
            onClick={() => remove(i)}
            type="button"
          >
            Remover
          </button>
        </div>
      ))}
      {fields.length === 0 && (
        <EmptyState title="Nenhum mérito ou defeito">
          Méritos custam pontos positivos; defeitos devolvem pontos. Adicione o
          primeiro abaixo.
        </EmptyState>
      )}
      <button
        className={cn(
          ACTION,
          "mt-3 inline-block cursor-pointer border border-line px-3 py-2"
        )}
        onClick={() => append({ nome: "", pontos: 1, tipo: "vantagem" })}
        type="button"
      >
        Adicionar
      </button>
    </>
  );
}
