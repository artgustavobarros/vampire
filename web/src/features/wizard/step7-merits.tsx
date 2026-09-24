import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { Field } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { DotRating } from "#/components/vtm/dot-rating";
import { InfoButton } from "#/components/vtm/info-trigger";
import { EmptyState } from "#/components/vtm/text";
import { cn } from "#/lib/utils";
import { meritTotals } from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

const ACTION =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest";

export function Step7Merits() {
  const { control } = useWizardForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "meritos",
  });
  const meritos = useWatch({ control, name: "meritos" });
  const totals = meritTotals({ meritos });

  return (
    <>
      <div className={cn(ACTION, "mb-3 flex gap-4 text-ink-soft")}>
        <span>{totals.vantagens} pts em vantagens</span>
        <span>{totals.defeitos} pts em defeitos</span>
      </div>
      {fields.map((row, i) => (
        <div
          className="flex flex-wrap items-start gap-3 border-line-soft border-b py-2"
          key={row.id}
        >
          <Controller
            control={control}
            name={`meritos.${i}.tipo`}
            render={({ field }) => (
              <button
                className={cn(
                  ACTION,
                  "mt-2 cursor-pointer whitespace-nowrap px-2 py-1",
                  field.value === "defeito"
                    ? "bg-blood text-white"
                    : "bg-ink text-white"
                )}
                onClick={() =>
                  field.onChange(
                    field.value === "defeito" ? "vantagem" : "defeito"
                  )
                }
                title="Alternar vantagem/defeito"
                type="button"
              >
                {field.value === "defeito" ? "Defeito" : "Vantagem"}
              </button>
            )}
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
              tipo: meritos[i]?.tipo ?? "vantagem",
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
